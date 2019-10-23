import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace uy.agesic.salud{
   export class Institution extends Participant {
      oid: string;
      name: string;
   }
   export enum AvailabilityStatus {
      approved,
      deprecated,
   }
   export enum ConfidentialyCode {
      N,
      R,
      V,
   }
   export enum RelationshipType {
      APND,
      XFRM,
      RPLC,
      XFRM_RPLC,
   }
   export class Author {
      cedula: string;
      authorlocation: string;
      primernombre: string;
      segundonombre: string;
      primerapellido: string;
      segundoapellido: string;
      authorrole: string;
      authorspecialty: string;
   }
   export class DocumentEntryAsset extends Asset {
      uniqueid: string;
      availabilitystatus: AvailabilityStatus;
      amountofstudies: number;
      author: Author;
      authorinstitution: Institution;
      byorderof: Institution;
      classcode: string;
      confidentialycode: ConfidentialyCode;
      eventcodelist: string[];
      funder: string;
      practicesettingcode: string;
      typecode: string;
      comment: string;
      sourcepatientid: string;
      title: string;
      hash: string;
      repositoryuniqueid: string;
      servicestarttime: Date;
      servicestoptime: Date;
      relation_uniqueid: string;
      relationtype: RelationshipType;
   }
   export class RegisterDocumentSet extends Transaction {
      uniqueid: string;
      availabilitystatus: AvailabilityStatus;
      amountofstudies: number;
      author: Author;
      authorinstitution: Institution;
      byorderof: Institution;
      classcode: string;
      confidentialycode: ConfidentialyCode;
      eventcodelist: string[];
      funder: string;
      practicesettingcode: string;
      typecode: string;
      comment: string;
      sourcepatientid: string;
      title: string;
      hash: string;
      repositoryuniqueid: string;
      servicestarttime: Date;
      servicestoptime: Date;
      relation_uniqueid: string;
      relationtype: RelationshipType;
   }
   export class RegisterDocument extends Event {
      documententry: DocumentEntryAsset;
   }
// }
