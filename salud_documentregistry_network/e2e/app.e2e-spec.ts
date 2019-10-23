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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for salud_documentregistry_network', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be salud_documentregistry_network', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('salud_documentregistry_network');
    })
  });

  it('network-name should be salud_documentregistry_network@0.0.1',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('salud_documentregistry_network@0.0.1.bna');
    });
  });

  it('navbar-brand should be salud_documentregistry_network',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('salud_documentregistry_network');
    });
  });

  
    it('DocumentEntryAsset component should be loadable',() => {
      page.navigateTo('/DocumentEntryAsset');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DocumentEntryAsset');
      });
    });

    it('DocumentEntryAsset table should have 22 columns',() => {
      page.navigateTo('/DocumentEntryAsset');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(22); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Institution component should be loadable',() => {
      page.navigateTo('/Institution');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Institution');
      });
    });

    it('Institution table should have 3 columns',() => {
      page.navigateTo('/Institution');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('RegisterDocumentSet component should be loadable',() => {
      page.navigateTo('/RegisterDocumentSet');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('RegisterDocumentSet');
      });
    });
  

});