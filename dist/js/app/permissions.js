define(['config', 'Vue', 'axios', 'vee-validate', 'lodash', 'vue-select', 'moment', 'VueBootstrapDatetimePicker', 'eonasdan-bootstrap-datetimepicker'], function(abyss, Vue, axios, VeeValidate, _, VueSelect, moment, VueBootstrapDatetimePicker) {
	Vue.component('date-picker', VueBootstrapDatetimePicker.default);
	Vue.component('v-select', VueSelect.VueSelect);
// ■■■■■■■■ index ■■■■■■■■ //
	Vue.component('permissions', {
		props: {
			rootState: { type: String }
		},
		data() {
			return {
				isLoading: true,
				sort: {
					key: 'permission',
					type: String,
					order: 'asc'
				},
				sortCreated: {
					key: 'created',
					type: Date,
					order: 'desc'
				},
				pageState: 'init',
				paginate: {},
				permissionList: [],
				permissionOptions: [],
				selected: null,
				permission: {
					"uuid": null,
					"organizationid": null,
					"created": null,
					"updated": null,
					"deleted": null,
					"isdeleted": false,
					"crudsubjectid": null,
					"permission": null,
					"description": null,
					"effectivestartdate": null,
					"effectiveenddate": null,
					"subjectid": null,
					"resourceid": null,
					"resourceactionid": null,
					"accessmanagerid": null,
					"isactive": true,
					"resourceAction": {},
					"accessManager": {},
					"resource": {
						"resourceType": {}
					},
					"subject": {}
				},
				selectedPermission: {},
				newPermission: {},

				orgOptions: [],
				resourceOptions: [],
				subjectOptions: [],
				accessManagerOptions: [],
				resourceActionOptions: [],
				date: null,
				dateConfig: {
					format: 'YYYY-MM-DD HH:mm:ss',
					useCurrent: false,
					showClear: true,
					showClose: true,
				},
				end: []
			};
		},
		methods: {
			permissionEndpoint() {
				// 2DO /subject-permissions/organization/{uuid}
				if (this.$root.rootData.user.isAdmin) {
					return abyss.ajax.permission_list;
				} else {
					return abyss.ajax.permission_my_apis + this.$root.rootData.user.uuid;
				}
			},
			subjectEndpoint() {
				// 2DO /subjects/organization/{uuid}
				if (this.$root.rootData.user.isAdmin) {
					return abyss.ajax.subjects;
				} else {
					return abyss.ajax.subjects;
				}
			},
			resourceEndpoint() {
				if (this.$root.rootData.user.isAdmin) {
					return abyss.ajax.resources;
					// return abyss.ajax.resources_organization + this.$root.abyssOrgId;
				} else {
					return abyss.ajax.resources_subject + this.$root.rootData.user.uuid;
				}
			},
			cancelPermission() {
				var index = this.permissionList.indexOf(this.permission);
				this.permissionList[index] = this.selectedPermission;
				this.permission = _.cloneDeep(this.newPermission);
				this.selectedPermission = _.cloneDeep(this.newPermission);
				this.selected = null;
			},
			selectPermission(item, i) {
				this.fixProps(item);
				this.selectedPermission = _.cloneDeep(item);
				this.permission = item;
				this.selected = i;
			},
			isSelected(i) {
				return i === this.selected;
			},
			fixProps(item) {
				this.fillProps(item);
				if (item.subjectid == null) {
					Vue.set(item,'subjectid',this.$root.rootData.user.uuid);
				}
				if (item.effectiveenddate == null) {
					Vue.set(item, 'effectiveenddate', moment().add(6, 'months').format('YYYY-MM-DD HH:mm:ss'));
				}
				if (item.effectivestartdate == null) {
					Vue.set(item, 'effectivestartdate', moment().format('YYYY-MM-DD HH:mm:ss'));
				}
			},
			deleteProps(obj) {
				var item = this.cleanProps(obj);
				Vue.delete(item, 'resource');
				Vue.delete(item, 'accessManager');
				Vue.delete(item, 'resourceAction');
				Vue.delete(item, 'organization');
				Vue.delete(item, 'subject');
				item.effectivestartdate = moment(item.effectivestartdate).toISOString();
				item.effectiveenddate = moment(item.effectiveenddate).toISOString();
				return item;
			},
			async deletePermission(item) {
				var del = await this.deleteItem(abyss.ajax.permission_list, item, true);
				console.log("del: ", del);
				if (del) {
					this.$toast('success', {title: 'ITEM DELETED', message: 'Item deleted successfully', position: 'topRight'});
				}
			},
			/*deletePermission(item) {
				var r = confirm('Are you sure to delete?');
				if (r == true) {
					axios.delete(abyss.ajax.permission_list + '/' + item.uuid, item).then(response => {
						item.isdeleted = true;
						console.log("DELETE permission response: ", response);
					}, error => {
						this.handleError(error);
					});
				}
			},*/
			async permissionAction(act) {
				var result = await this.$validator.validateAll();
				if (result) {
					if (act == 'add') {
						this.fixProps(this.permission);
						var item = await this.addItem(abyss.ajax.permission_list, this.deleteProps(this.permission));
						this.getPage(1);
						this.$emit('set-state', 'init');
						this.permission = _.cloneDeep(this.newPermission);
					}
					if (act == 'edit') {
						var item = await this.editItem( abyss.ajax.permission_list, this.permission.uuid, this.deleteProps(this.permission) );
						this.getPage(1);
						this.$emit('set-state', 'init');
						this.permission = _.cloneDeep(this.newPermission);
						this.selected = null;
					}
				}
			},
			/*permissionAction(act) {
				this.$validator.validateAll().then((result) => {
					if (result) {
						if (act == 'add') {
							this.fixProps(this.permission);
							var itemArr = [];
							itemArr.push(this.deleteProps(this.permission));
							axios.post(abyss.ajax.permission_list, itemArr).then(response => {
								console.log("addPermission response: ", response);
								if (response.data[0].status != 500 ) {
									this.getPage(1);
									this.$emit('set-state', 'init');
									this.permission = _.cloneDeep(this.newPermission);
								}
							}, error => {
								this.handleError(error);
							});
						}
						if (act == 'edit') {
							this.updateItem(abyss.ajax.permission_list + '/' + this.permission.uuid, this.deleteProps(this.permission), this.permissionList).then(response => {
								console.log("editPermission response: ", response);
								this.getPage(1);
								this.$emit('set-state', 'init');
								this.permission = _.cloneDeep(this.newPermission);
								this.selected = null;
							});
						}
						return;
					}
				});
			},*/
			async filterPermission(filter) {
				if (filter == null) {
					this.getPage(1);
				} else {
					// this.permissionList = await this.getItem(abyss.ajax.permission_list, filter.uuid);
					this.permissionList = [];
					this.permissionList.push(filter);
					this.setPage();
				}
			},
			/*filterPermission(filter) {
				if (filter == null) {
					this.getPage(1);
				} else {
					axios.get(this.permissionEndpoint())
					.then(response => {
						if (response.data != null) {
							this.permissionList = [];
							this.permissionList.push(filter);
							this.setPage();
						}
					}, error => {
						this.handleError(error);
					});
				}
			},*/
			async getPermissionOptions(search, loading) {
				loading(true);
				this.permissionOptions = await this.getList(abyss.ajax.permission_list + '?likename=' + search);
				loading(false);
			},
			/*getPermissionOptions(search, loading) {
				loading(true);
				axios.get(this.permissionEndpoint() + '?likename=' + search)
				.then((response) => {
					if (response.data != null) {
						this.permissionOptions = response.data;
					} else {
						this.permissionOptions = [];
					}
					loading(false);
				}, error => {
					this.handleError(error);
					loading(false);
				});
			},*/
			async setPage() {
				this.permissionList.forEach(async (value, key) => {
					var rAct = _.find(this.$root.rootData.resourceActions, { 'uuid': value.resourceactionid });
					Vue.set(value, 'resourceAction', rAct );
					var rTyp = _.find(this.$root.rootData.resourceTypes, { 'uuid': rAct.resourcetypeid });
					Vue.set(value.resourceAction, 'resourceType', rTyp.type );
					var acMn = _.find(this.accessManagerOptions, { 'uuid': value.accessmanagerid });
					Vue.set(value, 'accessManager', acMn );
					var pOrg = _.find(this.orgOptions, { 'uuid': value.organizationid });
					Vue.set(value, 'organization', pOrg );
					var aTyp = _.find(this.accessManagerTypes, { 'uuid': acMn.accessmanagertypeid });
					Vue.set(value.accessManager, 'accessManagerType', aTyp );
					var resource = await this.getItem(abyss.ajax.resources, value.resourceid);
					Vue.set(value, 'resource', resource );
					var rTyp = _.find(this.$root.rootData.resourceTypes, { 'uuid': value.resource.resourcetypeid });
					Vue.set(value.resource, 'resourceType', rTyp );
					var subject = await this.getItem(abyss.ajax.subjects, value.subjectid);
					Vue.set(value, 'subject', subject );
					var sTyp = _.find(this.subjectTypes, { 'uuid': value.subject.subjecttypeid });
					Vue.set(value.subject, 'subjectType', sTyp.typename );
				});
			},
			/*setPage() {
				this.permissionList.forEach((value, key) => {
					var rAct = _.find(this.$root.rootData.resourceActions, { 'uuid': value.resourceactionid });
					Vue.set(value, 'resourceAction', rAct );
					var rTyp = _.find(this.$root.rootData.resourceTypes, { 'uuid': rAct.resourcetypeid });
					Vue.set(value.resourceAction, 'resourceType', rTyp.type );
					var acMn = _.find(this.accessManagerOptions, { 'uuid': value.accessmanagerid });
					Vue.set(value, 'accessManager', acMn );
					var pOrg = _.find(this.orgOptions, { 'uuid': value.organizationid });
					Vue.set(value, 'organization', pOrg );
					var aTyp = _.find(this.accessManagerTypes, { 'uuid': acMn.accessmanagertypeid });
					Vue.set(value.accessManager, 'accessManagerType', aTyp );
					axios.get(abyss.ajax.resources + '/' + value.resourceid).then(response => {
						Vue.set(value, 'resource', response.data[0] );
						var rTyp = _.find(this.$root.rootData.resourceTypes, { 'uuid': value.resource.resourcetypeid });
						Vue.set(value.resource, 'resourceType', rTyp );
						axios.get(abyss.ajax.subjects + '/' + value.subjectid).then(response => {
							Vue.set(value, 'subject', response.data[0] );
							var sTyp = _.find(this.subjectTypes, { 'uuid': value.subject.subjecttypeid });
							Vue.set(value.subject, 'subjectType', sTyp.typename );
						}, error => {
							this.handleError(error);
						});
					}, error => {
						this.handleError(error);
					});
				});
			},*/
			async getPage(p, d) {
				var access_managers = this.getList(abyss.ajax.access_managers);
				var access_manager_types = this.getList(abyss.ajax.access_manager_types);
				var subject_types = this.getList(abyss.ajax.subject_types);
				var resource_list = this.getList(this.resourceEndpoint());
				var subject_list = this.getList(this.subjectEndpoint());
				var permission_list = this.getList(this.permissionEndpoint());
				var organizations_list = this.getList(abyss.ajax.organizations_list);

				var [accessManagerOptions, accessManagerTypes, subjectTypes, resourceOptions, subjectOptions, permissionList, orgOptions] = await Promise.all([access_managers, access_manager_types, subject_types, resource_list, subject_list, permission_list, organizations_list]);

				this.accessManagerOptions = accessManagerOptions;
				this.accessManagerTypes = accessManagerTypes;
				this.subjectTypes = subjectTypes;
				this.resourceOptions = resourceOptions;
				this.subjectOptions = subjectOptions;

				this.resourceActionOptions = this.$root.rootData.resourceActions;
				this.$root.rootData.resourceTypes.forEach((value, key) => {
					if (value.type == 'API') {
						Vue.set(value, 'subjectTypeId', 'ca80dd37-7484-46d3-b4a1-a8af93b2d3c6' ); // APP
					} else {
						Vue.set(value, 'subjectTypeId', '21371a15-04f8-445e-a899-006ee11c0e09' ); // USER
					}
				});

				this.permissionList = permissionList;
				this.orgOptions = orgOptions;
				this.paginate = this.makePaginate(this.permissionList);
				this.setPage();
				this.preload();
			},
			/*getPage(p, d) {
				axios.all([
					axios.get(this.permissionEndpoint()),
				]).then(
					axios.spread((permission_list) => {
						this.permissionList = permission_list.data;
						this.paginate = this.makePaginate(permission_list.data);
						this.setPage();
						this.preload();
					})
				).catch(error => {
					this.handleError(error);
				});
			},*/
		},
		created() {
			this.$emit('set-page', 'permissions', 'init');
			this.newPermission = _.cloneDeep(this.permission);
			this.getPage(1);
			/*axios.all([
				axios.get(abyss.ajax.access_managers),
				axios.get(abyss.ajax.access_manager_types),
				axios.get(abyss.ajax.subject_types),
				axios.get(this.resourceEndpoint()),
				axios.get(this.subjectEndpoint()),
				axios.get(abyss.ajax.organizations_list),
			]).then(
				axios.spread((access_managers, access_manager_types, subject_types, resources, subjects, organizations_list) => {
					this.accessManagerTypes = access_manager_types.data;
					this.subjectTypes = subject_types.data;
					this.accessManagerOptions = access_managers.data;
					this.resourceOptions = resources.data;
					this.subjectOptions = subjects.data;
					// this.orgOptions = this.$root.rootData.user.organizations;
					this.orgOptions = organizations_list.data;
					this.resourceActionOptions = this.$root.rootData.resourceActions;
					this.$root.rootData.resourceTypes.forEach((value, key) => {
						if (value.type == 'API') {
							Vue.set(value, 'subjectTypeId', 'ca80dd37-7484-46d3-b4a1-a8af93b2d3c6' ); // APP
						} else {
							Vue.set(value, 'subjectTypeId', '21371a15-04f8-445e-a899-006ee11c0e09' ); // USER
						}
					});
					this.getPage(1);
				})
			).catch(error => {
				this.handleError(error);
			});*/
		}
	});
});