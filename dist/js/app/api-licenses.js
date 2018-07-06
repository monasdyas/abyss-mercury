define(['config', 'Vue', 'axios', 'vee-validate', 'vue-select', 'moment'], function(abyss, Vue, axios, VeeValidate, VueSelect, moment) {
	Vue.component('v-select', VueSelect.VueSelect);
	Vue.component('api-licenses', {
		props: {
			rootState: { type: String }
		},
		data() {
			return {
				isLoading: true,
				sort: {
					key: 'name',
					type: String,
					order: 'asc'
				},
				pageState: 'init',
				paginate: {},
				ajaxLicenseUrl: abyss.ajax.licenses_list,
				ajaxUrl: abyss.ajax.subject_licenses_list + this.$cookie.get('abyss.principal.uuid'),
				ajaxHeaders: {},
				selected: null,
				license: {
					"uuid": null,
					"organizationid": null,
					"created": null,
					"updated": null,
					"deleted": null,
					"isdeleted": false,
					"crudsubjectid": null,
					"name": null,
					"version": null,
					"subjectid": null,
					"policies": null,
					"licensedocument": {
						"sla": {
							"tierName": "Silver",
							"description": "Silver SLA Package",
							"performance": "10Mbit/s",
							"availability": 98,
							"supportHours": "8x5",
							"blackOutHoursPerYear": 36
						},
						"info": {
							"title": "Pet API License",
							"version": "1.0.0",
							"visibility": "Public",
							"description": "Pet API License Description"
						},
						"legal": {
							"link": "http://example.com/legals/{LegalDocumentID}",
							"name": "Pet API Legal Aggrement",
							"description": "Pet API Legal Aggrement",
							"documentText": null,
							"agreementType": "signup",
							"documentState": "active",
							"legalDocumentID": null
						},
						"openApiLicense": "0.0.2",
						"termsOfService": {
							"policyKey": []
						}
					}
				},
				selectedLicense: {},
				newLicense: {},
				licenseList: [],
				policyList: [],
				end: []
			};
		},
		computed: {
			licensePolicies : {
				get() {
					return this.license.licensedocument.termsOfService.policyKey;
				},
				set(newVal) {
					
				}
			},
		},
		methods: {
			cancelLicense() {
				var index = this.licenseList.indexOf(this.license);
				this.licenseList[index] = this.selectedLicense;
				this.license = _.cloneDeep(this.newLicense);
				this.selectedLicense = _.cloneDeep(this.newLicense);
				this.selected = null;
			},
			fixProps(item) {
				if (item.subjectid == null) {
					Vue.set(item,'subjectid',this.$root.rootData.user.uuid);
				}
				if (item.crudsubjectid == null) {
					Vue.set(item,'crudsubjectid',this.$root.rootData.user.uuid);
				}
				if (item.organizationid == null) {
					Vue.set(item,'organizationid',this.$root.rootData.user.organizationid);
				}
				if (item.licensedocument.legal.legalDocumentID == null) {
					Vue.set(item.licensedocument.legal, 'legalDocumentID', this.uuidv4() );
				}
			},
			selectLicense(item, i) {
				this.fixProps(item);
				this.selectedLicense = _.cloneDeep(item);
				this.license = item;
				this.selected = i;
			},
			isSelected(i) {
				return i === this.selected;
			},
			deleteLicense(item) {
				axios.delete(this.ajaxLicenseUrl + item.uuid, item, this.ajaxHeaders).then(response => {
					item.isdeleted = true;
					console.log("deleteUser response: ", response);
				}, error => {
					this.handleError(error);
				});
			},
			deleteProps() {
				var item = _.cloneDeep(this.license);
				Vue.set(item.licensedocument.termsOfService, 'policyKey', item.policies.map(e => e.uuid) );
				Vue.set(item.licensedocument.info, 'version', item.version);
				if (item.licensedocument.legal.legalDocumentID == null) {
					Vue.set(item.licensedocument.legal, 'legalDocumentID', this.uuidv4() );
				}
				Vue.delete(item, 'uuid');
				Vue.delete(item, 'created');
				Vue.delete(item, 'updated');
				Vue.delete(item, 'deleted');
				Vue.delete(item, 'isdeleted');
				Vue.delete(item, 'policies');
				return item;
			},
			licenseAction(act) {
				this.$validator.validateAll().then((result) => {
					if (result) {
						if (act == 'add') {
							this.fixProps(this.license);
							var itemArr = [];
							itemArr.push(this.deleteProps());
							console.log("itemArr: ", itemArr);
							// this.addItem(this.ajaxUrl, itemArr, this.ajaxHeaders, this.licenseList).then(response => {
							// axios.post(this.ajaxUrl, itemArr, this.ajaxHeaders).then(response => {
							axios.post(this.ajaxLicenseUrl, itemArr, this.ajaxHeaders).then(response => {
								console.log("addLicense response: ", response);
								if (response.data[0].status != 500 ) {
									var newLcs = response.data[0].response;
									Vue.set(newLcs, 'policies', _.filter(this.policyList, (v) => _.includes(newLcs.licensedocument.termsOfService.policyKey, v.uuid)) );
									this.licenseList.push(newLcs);
									this.$emit('set-state', 'init');
									this.license = _.cloneDeep(this.newLicense);
								}
							}, error => {
								this.handleError(error);
							});
						}
						if (act == 'edit') {
							console.log("this.deleteProps(): ", this.deleteProps());
							this.updateItem(this.ajaxLicenseUrl + this.license.uuid, this.deleteProps(), this.ajaxHeaders, this.licenseList).then(response => {
								console.log("editLicense response: ", response);
								this.$emit('set-state', 'init');
								this.license = _.cloneDeep(this.newLicense);
								this.selected = null;
							});
						}
						return;
					}
				});
			},
			getPage(p, d) {
				var param = d || '';
				axios.get(this.ajaxUrl + '?page=' + p + param, this.ajaxHeaders)
				.then(response => {
					var newLcs = response.data;
					newLcs.forEach((value, key) => {
						Vue.set(value, 'policies', _.filter(this.policyList, (v) => _.includes(value.licensedocument.termsOfService.policyKey, v.uuid)) );
					});
					this.licenseList = newLcs;
					this.paginate = this.makePaginate(response.data);
					this.preload();
				}, error => {
					this.handleError(error);
				});
			},
		},
		mounted() {
			// this.preload();
		},
		created() {
			this.log(this.$options.name);
			this.$emit('set-page', 'licenses', 'init');
			this.newLicense = _.cloneDeep(this.license);
			axios.all([
				// axios.get(abyss.ajax.subject_policies_list + this.$cookie.get('abyss.principal.uuid')),
				axios.get(abyss.ajax.subject_policies_list + this.$root.rootData.user.uuid ),
			]).then(
				axios.spread((subject_policies_list) => {
					this.policyList = subject_policies_list.data.filter( (item) => item.isdeleted == false );
					this.getPage(1);
				})
			).catch(error => {
				this.handleError(error);
			});
			// console.log("this.$root.rootData.user.organizationid: ", this.$root.rootData.user.organizationid);
		}
	});
});