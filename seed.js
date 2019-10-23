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

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'Student'
// and a 'Test' and 'Result'  assets.

'use strict';


const namespace = 'uy.agesic.salud';
const assetType = 'DocumentEntryAsset';
const assetNS = namespace + '.' + assetType;
const participantType = 'Institution';
const participantNS = namespace + '.' + participantType;


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

/**
 * Adds participants and assets
 */
async function addParticipantsAssets() {

    let businessNetworkConnection = new BusinessNetworkConnection();

    let businessNetworkDefinition = await businessNetworkConnection.connect('admin@salud_documentregistry_network');

    let factory = businessNetworkDefinition.getFactory();

    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(participantNS);

    // Create the participants.
    const casmu = factory.newResource(namespace, participantType, '1234');
    casmu.name = 'Centro de Asistencia del Sindicato Médico del Uruguay';

    const asse = factory.newResource(namespace, participantType, '9876');
    asse.name = 'Administración de los Servicios de Salud del Estado';

    await participantRegistry.addAll([casmu, asse]);

    // Create the assets.
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


    await businessNetworkConnection.disconnect();
}

addParticipantsAssets().then(() => {
// Everything went fine
    console.log('Added!!');
    process.exit(0);
}).catch((error) => {
// Something went wrong
    console.error(error);
    process.exit(1);
});