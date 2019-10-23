/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));

const namespace = 'uy.agesic.salud';
const assetType = 'DocumentEntryAsset';
const assetNS = namespace + '.' + assetType;
const participantType = 'Institution';
const participantNS = namespace + '.' + participantType;

describe('#' + namespace, () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

    // Embedded connection used for local testing
    const connectionProfile = {
        name: 'embedded',
        'x-type': 'embedded'
    };

    // Name of the business network card containing the administrative identity for the business network
    const adminCardName = 'admin';

    // Admin connection to the blockchain, used to deploy the business network
    let adminConnection;

    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Alice and Bob.
    const casmuCardName = 'CASMU';
    const asseCardName = 'ASSE';

    // These are a list of receieved events.
    let events;

    let businessNetworkName;

    before(async () => {
        // Generate certificates for use with the embedded connection
        const credentials = CertificateUtil.generate({ commonName: 'admin' });

        // Identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);
        const deployerCardName = 'PeerAdmin';

        adminConnection = new AdminConnection({ cardStore: cardStore });

        await adminConnection.importCard(deployerCardName, deployerCard);
        await adminConnection.connect(deployerCardName);
    });

    /**
     *
     * @param {String} cardName The card name to use for this identity
     * @param {Object} identity The identity details
     */
    async function importCardForIdentity(cardName, identity) {
        const metadata = {
            userName: identity.userID,
            version: 1,
            enrollmentSecret: identity.userSecret,
            businessNetwork: businessNetworkName
        };
        const card = new IdCard(metadata, connectionProfile);
        await adminConnection.importCard(cardName, card);
    }

    // This is called before each test is executed.
    beforeEach(async () => {
        // Generate a business network definition from the project directory.
        let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        businessNetworkName = businessNetworkDefinition.getName();
        await adminConnection.install(businessNetworkDefinition);
        const startOptions = {
            networkAdmins: [
                {
                    userName: 'admin',
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkName, businessNetworkDefinition.getVersion(), startOptions);
        await adminConnection.importCard(adminCardName, adminCards.get('admin'));

        // Create and establish a business network connection
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        events = [];
        businessNetworkConnection.on('event', event => {
            events.push(event);
        });
        await businessNetworkConnection.connect(adminCardName);

        // Get the factory for the business network.
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();

        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(participantNS);
        // Create the participants.
        const casmu = factory.newResource(namespace, participantType, '1234');
        casmu.name = 'Centro de Asistencia del Sindicato Médico del Uruguay';

        const asse = factory.newResource(namespace, participantType, '9876');
        asse.name = 'Administración de los Servicios de Salud del Estado';

        participantRegistry.addAll([casmu, asse]);

        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);

        // Create the assets.
        const de1 = factory.newResource(namespace, assetType, '01');
        de1.availabilitystatus = 'approved';
        de1.amountofstudies = 1;
        const author = factory.newConcept(namespace, 'Author');
            author.cedula = '12345678';
            author.authorlocation = 'Dependencia 1'
            author.authorrole = 'medico';
            author.authorspecialty = 'Traumatólogo';
            author.primernombre = 'Juan';
            author.primerapellido = 'Perez';
        de1.author = author;
        de1.authorinstitution = factory.newRelationship(namespace, participantType, '1234');
        de1.classcode = 'Hoja de cirugia';
        de1.confidentialycode = 'N';
        de1.eventcodelist = ['1234-5'];
        de1.funder = 'Fondo Nacional de Recursos';
        de1.practicesettingcode = 'Certificado de nacido vivo';
        de1.typecode = 'Informe de alta';
        de1.comment = 'Este es un comentario asociado al documento';
        de1.sourcepatientid = 'p01';
        de1.title = 'Titulo del documento';
        de1.hash = 'asdqwe123';
        de1.repositoryuniqueid = 'r01';
        de1.servicestarttime = new Date();
        de1.servicestoptime = new Date();

        // Create the assets.
        const de2= factory.newResource(namespace, assetType, '02');
        de2.availabilitystatus = 'approved';
        de2.amountofstudies = 1;
        const author2 = factory.newConcept(namespace, 'Author');
            author2.cedula = '9876543';
            author2.authorlocation = 'Dependencia A'
            author2.authorrole = 'medico';
            author2.authorspecialty = 'Cardiologo';
            author2.primernombre = 'Pedro';
            author2.primerapellido = 'Rodriguez';
        de2.author = author2;
        de2.authorinstitution = factory.newRelationship(namespace, participantType, '9876');
        de2.classcode = 'Hoja de cirugia';
        de2.confidentialycode = 'N';
        de2.eventcodelist = ['1233-5'];
        de2.funder = 'Fondo Nacional de Recursos';
        de2.practicesettingcode = 'Certificado X';
        de2.typecode = 'Informe X';
        de2.comment = 'Este es un comentario asociado al documento';
        de2.sourcepatientid = 'p01';
        de2.title = 'Titulo del documento X';
        de2.hash = 'asdqwe123';
        de2.repositoryuniqueid = 'r01';
        de2.servicestarttime = new Date();
        de2.servicestoptime = new Date();


        await assetRegistry.addAll([de1, de2]);

        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(participantNS + '#1234', 'casmu1');
        await importCardForIdentity(casmuCardName, identity);
        identity = await businessNetworkConnection.issueIdentity(participantNS + '#9876', 'asse1');
        await importCardForIdentity(asseCardName, identity);
    });

    /**
     * Reconnect using a different identity.
     * @param {String} cardName The name of the card for the identity to use
     */
    async function useIdentity(cardName) {
        await businessNetworkConnection.disconnect();
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        events = [];
        businessNetworkConnection.on('event', (event) => {
            events.push(event);
        });
        await businessNetworkConnection.connect(cardName);
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    }

    it('Casmu puede leer todos los documentos', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        const assets = await assetRegistry.getAll();

        // Validate the assets.
        assets.should.have.lengthOf(2);
    });

    it('Asse puede leer todos los documentos', async () => {
        // Use the identity for Asse.
        await useIdentity(asseCardName);
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        const assets = await assetRegistry.getAll();

        // Validate the assets.
        assets.should.have.lengthOf(2);
    });

    it('Casmu no puede adicionar registros que no fueron emitidos por esta institucion', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Create the asset.
        const asset3 = factory.newResource(namespace, assetType, '03');
        asset3.availabilitystatus = 'approved';
        asset3.amountofstudies = 1;
        const author2 = factory.newConcept(namespace, 'Author');
            author2.cedula = '12312612';
            author2.authorlocation = 'Dependencia A'
            author2.authorrole = 'medico';
            author2.authorspecialty = 'Cardiologo';
            author2.primernombre = 'Pedro';
            author2.primerapellido = 'Rodriguez';
        asset3.author = author2;
        asset3.authorinstitution = factory.newRelationship(namespace, participantType, '9876');
        asset3.classcode = 'Hoja de cirugia';
        asset3.confidentialycode = 'N';
        asset3.eventcodelist = ['1233-5'];
        asset3.funder = 'Fondo Nacional de Recursos';
        asset3.practicesettingcode = 'Certificado X';
        asset3.typecode = 'Informe X';
        asset3.comment = 'Este es un comentario asociado al documento';
        asset3.sourcepatientid = 'p03';
        asset3.title = 'Titulo del documento X';
        asset3.hash = 'asdqwe123';
        asset3.repositoryuniqueid = 'r01';
        asset3.servicestarttime = new Date();
        asset3.servicestoptime = new Date();

        // Try to add the asset, should fail.
        const assetRegistry = await  businessNetworkConnection.getAssetRegistry(assetNS);
        await assetRegistry.add(asset3).should.be.rejectedWith(/does not have .* access to resource/);
        return asset3;
    });

    it('Casmu puede actualizar registros emitidos desde su institucines', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Acces the asset, then update the asset.
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        let asset1 = await assetRegistry.get('01');
        asset1.availabilitystatus = 'deprecated';
        await assetRegistry.update(asset1);

        // Validate the asset.
        asset1 = await assetRegistry.get('01');
        asset1.availabilitystatus.should.equal('deprecated');
    });

    it('Casmu no puede actualizar registros emitidos por instituciones de Asse', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        let asset1 = await assetRegistry.get('02');
        asset1.availabilitystatus = 'deprecated';

        // Try to update the asset, should fail.
        await assetRegistry.update(asset1).should.be.rejectedWith(/does not have .* access to resource/);
    });

    it('Casmu no puede eliminar sus registros', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Remove the asset, then test the asset exists.
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        await assetRegistry.remove('01').should.be.rejectedWith(/does not have .* access to resource/);
    });

    it('Casmu no puede eliminar los registros emitidos por Asse', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Remove the asset, then test the asset exists.
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        await assetRegistry.remove('02').should.be.rejectedWith(/does not have .* access to resource/);
    });

    it('Casmu puede hacer uso de la transacción RegisterDocumentSet sin ninguna relación con documento anterior', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Submit the transaction.
        const transaction = factory.newTransaction(namespace, 'RegisterDocumentSet');
        transaction.uniqueid = '03';
        transaction.availabilitystatus = 'approved';
        transaction.amountofstudies = 1;
        const author2 = factory.newConcept(namespace, 'Author');
            author2.cedula = '12312612';
            author2.authorlocation = 'Dependencia A'
            author2.authorrole = 'medico';
            author2.authorspecialty = 'Cardiologo';
            author2.primernombre = 'Pedro';
            author2.primerapellido = 'Rodriguez';
        transaction.author = author2;
        transaction.authorinstitution = factory.newRelationship(namespace, participantType, '1234');
        transaction.classcode = 'Hoja de cirugia';
        transaction.confidentialycode = 'N';
        transaction.eventcodelist = ['1233-5'];
        transaction.funder = 'Fondo Nacional de Recursos';
        transaction.practicesettingcode = 'Certificado TX';
        transaction.typecode = 'Informe X';
        transaction.comment = 'Este es un comentario asociado al documento';
        transaction.sourcepatientid = 'p03';
        transaction.title = 'Titulo del documento X';
        transaction.hash = 'asdqwe123';
        transaction.repositoryuniqueid = 'r01';
        transaction.servicestarttime = new Date();
        transaction.servicestoptime = new Date();

        await businessNetworkConnection.submitTransaction(transaction);

        // Get the asset.
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        const asset1 = await assetRegistry.get('03');

        // Validate the asset.
        asset1.practicesettingcode.should.equal('Certificado TX');

        // Validate the events.
        events.should.have.lengthOf(1);
        const event = events[0];
        event.documententry.getFullyQualifiedIdentifier().should.equal(assetNS + '#03');

    });

    it('Casmu no puede hacer uso de la transacción RegisterDocumentSet para un registro de Asse', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Submit the transaction.
        const transaction = factory.newTransaction(namespace, 'RegisterDocumentSet');
        transaction.uniqueid = '03';
        transaction.availabilitystatus = 'approved';
        transaction.amountofstudies = 1;
        const author2 = factory.newConcept(namespace, 'Author');
            author2.cedula = '12312612';
            author2.authorlocation = 'Dependencia A'
            author2.authorrole = 'medico';
            author2.authorspecialty = 'Cardiologo';
            author2.primernombre = 'Pedro';
            author2.primerapellido = 'Rodriguez';
        transaction.author = author2;
        transaction.authorinstitution = factory.newRelationship(namespace, participantType, '9876');
        transaction.classcode = 'Hoja de cirugia';
        transaction.confidentialycode = 'N';
        transaction.eventcodelist = ['1233-5'];
        transaction.funder = 'Fondo Nacional de Recursos';
        transaction.practicesettingcode = 'Certificado TX';
        transaction.typecode = 'Informe X';
        transaction.comment = 'Este es un comentario asociado al documento';
        transaction.sourcepatientid = 'p03';
        transaction.title = 'Titulo del documento X';
        transaction.hash = 'asdqwe123';
        transaction.repositoryuniqueid = 'r01';
        transaction.servicestarttime = new Date();
        transaction.servicestoptime = new Date();

        await businessNetworkConnection.submitTransaction(transaction).should.be.rejectedWith(/does not have '\CREATE\' access to resource/);
    });

    it('Casmu puede hacer uso de la transacción RegisterDocumentSet cambiando el estado del documento anterior', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);

        // Submit the transaction.
        const transaction = factory.newTransaction(namespace, 'RegisterDocumentSet');
        transaction.uniqueid = '03';
        transaction.availabilitystatus = 'approved';
        transaction.amountofstudies = 1;
        const author2 = factory.newConcept(namespace, 'Author');
            author2.cedula = '12312612';
            author2.authorlocation = 'Dependencia A'
            author2.authorrole = 'medico';
            author2.authorspecialty = 'Cardiologo';
            author2.primernombre = 'Pedro';
            author2.primerapellido = 'Rodriguez';
        transaction.author = author2;
        transaction.authorinstitution = factory.newRelationship(namespace, participantType, '1234');
        transaction.classcode = 'Hoja de cirugia';
        transaction.confidentialycode = 'N';
        transaction.eventcodelist = ['1233-5'];
        transaction.funder = 'Fondo Nacional de Recursos';
        transaction.practicesettingcode = 'Certificado TX';
        transaction.typecode = 'Informe X';
        transaction.comment = 'Este es un comentario asociado al documento';
        transaction.sourcepatientid = 'p03';
        transaction.title = 'Titulo del documento X';
        transaction.hash = 'asdqwe123';
        transaction.repositoryuniqueid = 'r01';
        transaction.servicestarttime = new Date();
        transaction.servicestoptime = new Date();
        transaction.relation_uniqueid = '01';
        transaction.relationtype = 'RPLC';

        await businessNetworkConnection.submitTransaction(transaction);

        // Get the asset.
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
        const assets = await assetRegistry.getAll();

        // Validate the asset.
        assets[0].availabilitystatus.should.equal('deprecated');
        assets.should.have.lengthOf(3);
    
        // Validate the events.
        events.should.have.lengthOf(1);
        const event = events[0];
        event.documententry.getFullyQualifiedIdentifier().should.equal(assetNS + '#03');
    });

    it('Casmu puede hacer uso de las consultas definidas', async () => {
        // Use the identity for Casmu.
        await useIdentity(casmuCardName);
        //const query = businessNetworkConnection.buildQuery("SELECT uy.agesic.salud.DocumentEntryAsset");

        const assests = await businessNetworkConnection.query('selectDocumentRegistryByPatient', {ci: 'p01'});
        assests.should.have.lengthOf(2);
        });
});
