import "isomorphic-fetch";
import { Aurelia, PLATFORM } from "aurelia-framework";
import "materialize-css";
// commment out if you would not like to load materialize CSS through a link on the index page
import "materialize-css/dist/css/materialize.css";
declare const IS_DEV_BUILD: boolean; // The value is supplied by Webpack during the build

export function configure(aurelia: Aurelia) {
	aurelia.use
		.standardConfiguration()
		.plugin(PLATFORM.moduleName("aurelia-materialize-bridge"), b => b.useAll());

	if (IS_DEV_BUILD) {
		aurelia.use.developmentLogging();
	}

	aurelia.start().then(() => aurelia.setRoot("app/components/app/app"));
}
