# contactsApp

This project provides a sample tutorial contact application based on Dojo 1.9 dojox/app module.

## Licensing

This project is distributed by the Dojo Foundation and licensed under the Dojo dual license [BSD/AFLv2 license](http://dojotoolkit.org/license).
All contributions require a [Dojo Foundation CLA](http://dojofoundation.org/about/claForm).

## Dependencies

This project requires the following other projects to run:
 * dojo
 * dijit
 * dojox/app
 * dojox/mobile
 * (optional, useful only if you want to build the app) util
 * (optional, useful only to run this in a cordova app) dcordova

## Installation

* Manual installation by dropping contactsApp as a sibling of the Dojo dojo directory:
 * contactsApp
 * dojo
 * dijit
 * dojox/app
 * dojox/mobile
 * util (optional)
 * dcordova (optional)

 To install the latest master, go to the root Dojo installation directory and clone contactsApp from github

 git clone git://github.com/cjolif/dojo-contacts-app.git contactsApp

## Build

You can build the contacts application by running the following command from util/buildscripts:

./build.sh --profile ../../contactsApp/build/build.profile.js
  --appConfigFile ../../contactsApp/contacts.json
  --appConfigLayer=contacts/contactsApp

This will make sure all the files needed by this application are bundled into compressed layers. The result can be
found in contactsApp-release/contactsApp

## Documentation

## Credits

* Christophe Jolif (IBM CCLA, committer)
* Ed Chatelain (IBM CCLA, committer)
