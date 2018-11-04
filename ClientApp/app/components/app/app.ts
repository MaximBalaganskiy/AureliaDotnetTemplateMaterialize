import { Aurelia, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

export class App {
	configureRouter(config: RouterConfiguration, router: Router) {
		config.title = "AureliaDotnetTemplate";
		config.map([{
			route: ["", "home"],
			name: "home",
			settings: { icon: "home" },
			moduleId: "../home/home",
			nav: true,
			title: "Home"
		}, {
			route: "counter",
			name: "counter",
			settings: { icon: "add" },
			moduleId: "../counter/counter",
			nav: true,
			title: "Counter"
		}, {
			route: "fetch-data",
			name: "fetchdata",
			settings: { icon: "list" },
			moduleId: "../fetchdata/fetchdata",
			nav: true,
			title: "Fetch data"
		}]);
	}
}
