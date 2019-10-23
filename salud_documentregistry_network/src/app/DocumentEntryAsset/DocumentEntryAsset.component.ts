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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DocumentEntryAssetService } from './DocumentEntryAsset.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-documententryasset',
  templateUrl: './DocumentEntryAsset.component.html',
  styleUrls: ['./DocumentEntryAsset.component.css'],
  providers: [DocumentEntryAssetService]
})
export class DocumentEntryAssetComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  uniqueid = new FormControl('', Validators.required);
  availabilitystatus = new FormControl('', Validators.required);
  amountofstudies = new FormControl('', Validators.required);
  author = new FormControl('', Validators.required);
  authorinstitution = new FormControl('', Validators.required);
  byorderof = new FormControl('', Validators.required);
  classcode = new FormControl('', Validators.required);
  confidentialycode = new FormControl('', Validators.required);
  eventcodelist = new FormControl('', Validators.required);
  funder = new FormControl('', Validators.required);
  practicesettingcode = new FormControl('', Validators.required);
  typecode = new FormControl('', Validators.required);
  comment = new FormControl('', Validators.required);
  sourcepatientid = new FormControl('', Validators.required);
  title = new FormControl('', Validators.required);
  hash = new FormControl('', Validators.required);
  repositoryuniqueid = new FormControl('', Validators.required);
  servicestarttime = new FormControl('', Validators.required);
  servicestoptime = new FormControl('', Validators.required);
  relation_uniqueid = new FormControl('', Validators.required);
  relationtype = new FormControl('', Validators.required);

  constructor(public serviceDocumentEntryAsset: DocumentEntryAssetService, fb: FormBuilder) {
    this.myForm = fb.group({
      uniqueid: this.uniqueid,
      availabilitystatus: this.availabilitystatus,
      amountofstudies: this.amountofstudies,
      author: this.author,
      authorinstitution: this.authorinstitution,
      byorderof: this.byorderof,
      classcode: this.classcode,
      confidentialycode: this.confidentialycode,
      eventcodelist: this.eventcodelist,
      funder: this.funder,
      practicesettingcode: this.practicesettingcode,
      typecode: this.typecode,
      comment: this.comment,
      sourcepatientid: this.sourcepatientid,
      title: this.title,
      hash: this.hash,
      repositoryuniqueid: this.repositoryuniqueid,
      servicestarttime: this.servicestarttime,
      servicestoptime: this.servicestoptime,
      relation_uniqueid: this.relation_uniqueid,
      relationtype: this.relationtype
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDocumentEntryAsset.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'uy.agesic.salud.DocumentEntryAsset',
      'uniqueid': this.uniqueid.value,
      'availabilitystatus': this.availabilitystatus.value,
      'amountofstudies': this.amountofstudies.value,
      'author': this.author.value,
      'authorinstitution': this.authorinstitution.value,
      'byorderof': this.byorderof.value,
      'classcode': this.classcode.value,
      'confidentialycode': this.confidentialycode.value,
      'eventcodelist': this.eventcodelist.value,
      'funder': this.funder.value,
      'practicesettingcode': this.practicesettingcode.value,
      'typecode': this.typecode.value,
      'comment': this.comment.value,
      'sourcepatientid': this.sourcepatientid.value,
      'title': this.title.value,
      'hash': this.hash.value,
      'repositoryuniqueid': this.repositoryuniqueid.value,
      'servicestarttime': this.servicestarttime.value,
      'servicestoptime': this.servicestoptime.value,
      'relation_uniqueid': this.relation_uniqueid.value,
      'relationtype': this.relationtype.value
    };

    this.myForm.setValue({
      'uniqueid': null,
      'availabilitystatus': null,
      'amountofstudies': null,
      'author': null,
      'authorinstitution': null,
      'byorderof': null,
      'classcode': null,
      'confidentialycode': null,
      'eventcodelist': null,
      'funder': null,
      'practicesettingcode': null,
      'typecode': null,
      'comment': null,
      'sourcepatientid': null,
      'title': null,
      'hash': null,
      'repositoryuniqueid': null,
      'servicestarttime': null,
      'servicestoptime': null,
      'relation_uniqueid': null,
      'relationtype': null
    });

    return this.serviceDocumentEntryAsset.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'uniqueid': null,
        'availabilitystatus': null,
        'amountofstudies': null,
        'author': null,
        'authorinstitution': null,
        'byorderof': null,
        'classcode': null,
        'confidentialycode': null,
        'eventcodelist': null,
        'funder': null,
        'practicesettingcode': null,
        'typecode': null,
        'comment': null,
        'sourcepatientid': null,
        'title': null,
        'hash': null,
        'repositoryuniqueid': null,
        'servicestarttime': null,
        'servicestoptime': null,
        'relation_uniqueid': null,
        'relationtype': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'uy.agesic.salud.DocumentEntryAsset',
      'availabilitystatus': this.availabilitystatus.value,
      'amountofstudies': this.amountofstudies.value,
      'author': this.author.value,
      'authorinstitution': this.authorinstitution.value,
      'byorderof': this.byorderof.value,
      'classcode': this.classcode.value,
      'confidentialycode': this.confidentialycode.value,
      'eventcodelist': this.eventcodelist.value,
      'funder': this.funder.value,
      'practicesettingcode': this.practicesettingcode.value,
      'typecode': this.typecode.value,
      'comment': this.comment.value,
      'sourcepatientid': this.sourcepatientid.value,
      'title': this.title.value,
      'hash': this.hash.value,
      'repositoryuniqueid': this.repositoryuniqueid.value,
      'servicestarttime': this.servicestarttime.value,
      'servicestoptime': this.servicestoptime.value,
      'relation_uniqueid': this.relation_uniqueid.value,
      'relationtype': this.relationtype.value
    };

    return this.serviceDocumentEntryAsset.updateAsset(form.get('uniqueid').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceDocumentEntryAsset.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDocumentEntryAsset.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'uniqueid': null,
        'availabilitystatus': null,
        'amountofstudies': null,
        'author': null,
        'authorinstitution': null,
        'byorderof': null,
        'classcode': null,
        'confidentialycode': null,
        'eventcodelist': null,
        'funder': null,
        'practicesettingcode': null,
        'typecode': null,
        'comment': null,
        'sourcepatientid': null,
        'title': null,
        'hash': null,
        'repositoryuniqueid': null,
        'servicestarttime': null,
        'servicestoptime': null,
        'relation_uniqueid': null,
        'relationtype': null
      };

      if (result.uniqueid) {
        formObject.uniqueid = result.uniqueid;
      } else {
        formObject.uniqueid = null;
      }

      if (result.availabilitystatus) {
        formObject.availabilitystatus = result.availabilitystatus;
      } else {
        formObject.availabilitystatus = null;
      }

      if (result.amountofstudies) {
        formObject.amountofstudies = result.amountofstudies;
      } else {
        formObject.amountofstudies = null;
      }

      if (result.author) {
        formObject.author = result.author;
      } else {
        formObject.author = null;
      }

      if (result.authorinstitution) {
        formObject.authorinstitution = result.authorinstitution;
      } else {
        formObject.authorinstitution = null;
      }

      if (result.byorderof) {
        formObject.byorderof = result.byorderof;
      } else {
        formObject.byorderof = null;
      }

      if (result.classcode) {
        formObject.classcode = result.classcode;
      } else {
        formObject.classcode = null;
      }

      if (result.confidentialycode) {
        formObject.confidentialycode = result.confidentialycode;
      } else {
        formObject.confidentialycode = null;
      }

      if (result.eventcodelist) {
        formObject.eventcodelist = result.eventcodelist;
      } else {
        formObject.eventcodelist = null;
      }

      if (result.funder) {
        formObject.funder = result.funder;
      } else {
        formObject.funder = null;
      }

      if (result.practicesettingcode) {
        formObject.practicesettingcode = result.practicesettingcode;
      } else {
        formObject.practicesettingcode = null;
      }

      if (result.typecode) {
        formObject.typecode = result.typecode;
      } else {
        formObject.typecode = null;
      }

      if (result.comment) {
        formObject.comment = result.comment;
      } else {
        formObject.comment = null;
      }

      if (result.sourcepatientid) {
        formObject.sourcepatientid = result.sourcepatientid;
      } else {
        formObject.sourcepatientid = null;
      }

      if (result.title) {
        formObject.title = result.title;
      } else {
        formObject.title = null;
      }

      if (result.hash) {
        formObject.hash = result.hash;
      } else {
        formObject.hash = null;
      }

      if (result.repositoryuniqueid) {
        formObject.repositoryuniqueid = result.repositoryuniqueid;
      } else {
        formObject.repositoryuniqueid = null;
      }

      if (result.servicestarttime) {
        formObject.servicestarttime = result.servicestarttime;
      } else {
        formObject.servicestarttime = null;
      }

      if (result.servicestoptime) {
        formObject.servicestoptime = result.servicestoptime;
      } else {
        formObject.servicestoptime = null;
      }

      if (result.relation_uniqueid) {
        formObject.relation_uniqueid = result.relation_uniqueid;
      } else {
        formObject.relation_uniqueid = null;
      }

      if (result.relationtype) {
        formObject.relationtype = result.relationtype;
      } else {
        formObject.relationtype = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'uniqueid': null,
      'availabilitystatus': null,
      'amountofstudies': null,
      'author': null,
      'authorinstitution': null,
      'byorderof': null,
      'classcode': null,
      'confidentialycode': null,
      'eventcodelist': null,
      'funder': null,
      'practicesettingcode': null,
      'typecode': null,
      'comment': null,
      'sourcepatientid': null,
      'title': null,
      'hash': null,
      'repositoryuniqueid': null,
      'servicestarttime': null,
      'servicestoptime': null,
      'relation_uniqueid': null,
      'relationtype': null
      });
  }

}
