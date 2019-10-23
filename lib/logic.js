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
 * Write your transction processor functions here
 */

const NS= 'uy.agesic.salud';

/**
 * RegisterDocumentSer transaction
 * @param {uy.agesic.salud.RegisterDocumentSet} tx todos los metadatos necesarios para crear el registro
 * @transaction
 */
async function RegisterDocumentSet(tx) {
   const assetRegistry = await getAssetRegistry(NS+'.DocumentEntryAsset');
  // Creo el activo de tipo DocumentEntryAsset
   let documententry = getFactory().newResource(NS,'DocumentEntryAsset',tx.uniqueid);
   documententry.availabilitystatus = tx.availabilitystatus;
   documententry.amountofstudies = tx.amountofstudies;
   documententry.author = tx.author;
   documententry.authorinstitution = tx.authorinstitution;
   documententry.byorderof = ((tx.byorderof !== null && tx.byorderof !== undefined)? tx.byorderof : undefined );
   documententry.classcode = tx.classcode;
   documententry.confidentialycode = tx.confidentialycode;
   documententry.eventcodelist = tx.eventcodelist;
   documententry.funder = ((tx.funder !== null && tx.funder !== undefined) ? tx.funder : undefined);
   documententry.practicesettingcode = tx.practicesettingcode;
   documententry.typecode = tx.typecode;
   documententry.comment = tx.comment;
   documententry.sourcepatientid = tx.sourcepatientid;
   documententry.title = tx.title;
   documententry.hash = tx.hash;
   documententry.repositoryuniqueid = tx.repositoryuniqueid;
   documententry.servicestarttime = tx.servicestarttime;
   documententry.servicestoptime = tx.servicestoptime

   if (tx.relation_uniqueid !== null && tx.relation_uniqueid !== undefined) {
       if (await(assetRegistry.exists(tx.relation_uniqueid))) {
            documententry.relation_uniqueid = tx.relation_uniqueid;
            documententry.relationtype = tx.relationtype;
            documententry.availabilitystatus = 'approved';
            switch (tx.relationtype) {
                case 'RPLC':
                case 'XFRM_RPLC': 
                    let relation_document = await assetRegistry.get(tx.relation_uniqueid);
                    relation_document.availabilitystatus = 'deprecated';
                    await assetRegistry.update(relation_document);
                    break;
            }
        }
        else
           throw new Error('No existe un DocumentEntry con el uniqueid '+tx.relation_uniqueid) 
   }
   
   //Emitimos el evento de la creación de la transaccioón
   let eventRegisterDocument = getFactory().newEvent(NS,'RegisterDocument');
   eventRegisterDocument.documententry = documententry;
   await emit(eventRegisterDocument);

   // Persistimos el documento !!!
   await assetRegistry.add(documententry);
   return documententry;
}
