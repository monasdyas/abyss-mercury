define(['config', 'Vue', 'axios', 'vee-validate', 'lodash', 'vue-select', 'moment'], function(abyss, Vue, axios, VeeValidate, _, VueSelect, moment) {
	Vue.component('v-select', VueSelect.VueSelect);
	Vue.component('users', {
		props: {
			rootState: { type: String }
		},
		data() {
			return {
				isLoading: true,
				sort: {
					key: 'firstname',
					type: String,
					order: 'asc'
				},
				pageState: 'init',
				paginate: {},
				selected: null,
				resetPassword: false,
				user: {
					"uuid": null,
					"organizationid": null,
					"created": null,
					"updated": null,
					"deleted": null,
					"isdeleted": false,
					"crudsubjectid": null,
					"isactivated": false,
					"subjecttypeid": abyss.defaultIds.subjectTypeUser,
					"subjectname": null,
					"firstname": null,
					"lastname": null,
					"displayname": null,
					"url": null,
					"email": null,
					"secondaryemail": null,
					"effectivestartdate": moment.utc().format('YYYY-MM-DD HH:mm:ss'),
					"effectiveenddate": moment.utc().add(50, 'years').format('YYYY-MM-DD HH:mm:ss'),
					"password": null,
					"picture": null,
					"totallogincount": null,
					"failedlogincount": null,
					"invalidpasswordattemptcount": null,
					"ispasswordchangerequired": true,
					"passwordexpiresat": null,
					"lastloginat": "",
					"lastpasswordchangeat": "",
					"lastauthenticatedat": "",
					"lastfailedloginat": "",
					"subjectdirectoryid": null,
					"islocked": false,
					"issandbox": false,
					"isrestrictedtoprocessing": false,
					"description": null,

					"groups": [],
					"membershiplist": [],
					"groupslist": [],
					// "permissions": [],
					// "permissionslist": [],
					// "permissionfilter": true,
					"groupfilter": true,
					"userfilter": true
				},
				selectedUser: {},
				newUser: {},
				userList: [],

				groupOptions: [],
				// permissionOptions: [],
				orgOptions: [],
				directoryOptions: [],
				memberOptions: [],

				memberAdd: [],
				memberDelete: [],

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
			/*async getPermissionOptions(search, loading) {
				loading(true);
				var permissionOptions = await this.getList(abyss.ajax.permission_list + '?likename=' + search);
				this.permissionOptions = permissionOptions.filter( (item) => !item.isdeleted );
				loading(false);
			},*/
			regenPass(numLc, numUc, numDigits, numSpecial) {
				Vue.set(this.user, 'password',this.generatePassword(numLc, numUc, numDigits, numSpecial));
			},
			getGroupName(dir) {
				var subGrp = this.memberOptions.filter((el) => el.subjectid == dir );
				var grpName = [];
				if (subGrp) {
					subGrp.forEach((value, key) => {
						grpName.push(this.groupOptions.find((el) => el.uuid == value.subjectgroupid ));
					});
					return grpName.map(e => e.firstname).join(', ');
				} else {
					return false;
				}
			},
			filterGroup(filter) {
				if (filter == null) {
					// this.getPage(1);
					// var sss = _.filter(this.userList, (item) => _.find(flt, { filtered: 'group' }));
					var sss = this.userList.filter((item) => item.groupfilter === false );
					sss.forEach((value, key) => {
						value.groupfilter = true;
					});
				} else {
					// this.getPage(1, '&group='+filter.uuid);
					var flt = this.memberOptions.filter((item) => item.subjectgroupid == filter.uuid );
					var xxx = _.reject(this.userList, (item) => _.find(flt, { subjectid: item.uuid }));
					xxx.forEach((value, key) => {
						value.groupfilter = false;
					});
				}
			},
			async getGroupOptions(search, loading) {
				loading(true);
				this.groupOptions = await this.getList(abyss.ajax.user_group_list + '?likename=' + search);
				loading(false);
			},
			getDirName(dir) {
				var subDir = this.directoryOptions.find((el) => el.uuid == dir );
				if (subDir) {
					return subDir.directoryname;
				} else {
					return false;
				}
			},
			// getPermissionName(dir) {
			// 	var subPrm = this.permissionOptions.filter((el) => el.subjectid == dir );
			// 	if (subPrm) {
			// 		return subPrm.map(e => e.permission).join(', ');
			// 	} else {
			// 		return false;
			// 	}
			// },
			// filterPermission(filter) {
			// 	if (filter == null) {
			// 		// this.getPage(1);
			// 		var sss = this.userList.filter((item) => item.permissionfilter === false );
			// 		sss.forEach((value, key) => {
			// 			value.permissionfilter = true;
			// 		});
			// 	} else {
			// 		// this.getPage(1, '&permission='+filter.uuid);
			// 		var flt = this.permissionOptions.filter((item) => item.uuid == filter.uuid );
			// 		var xxx = _.reject(this.userList, (item) => _.find(flt, { subjectid: item.uuid }));
			// 		xxx.forEach((value, key) => {
			// 			value.permissionfilter = false;
			// 		});
			// 	}
			// },
			async filterUser(filter) {
				if (filter == null) {
					this.getPage(1);
				} else {
					// var userList = await this.getItem(abyss.ajax.subjects, filter.uuid);
					this.userList = [];
					this.userList.push(filter);
					// this.userList = _.map(this.userList, o => _.extend({permissionfilter: true, groupfilter: true, userfilter: true}, o));
					this.userList = _.map(this.userList, o => _.extend({groupfilter: true, userfilter: true}, o));
				}
			},
			// 2DO
			// setUserPermissions(filter) {
			// 	console.log("filter: ", filter);
			// 	console.log("this.user.uuid: ", this.user.uuid);
			// },
			setUserGroups(filter) {
				console.log("this.user.groups: ", this.user.groups);
				console.log("this.user.membershiplist: ", this.user.membershiplist);
				if (filter && filter.length !== 0) {
					var itemArr = [];
					filter.forEach((value, key) => {
						var newObj = {
							"organizationid": this.user.organizationid,
							"crudsubjectid": this.$root.rootData.user.uuid,
							"subjectid": this.user.uuid,
							"subjectgroupid": value.uuid
						};
						itemArr.push(newObj);
					});
					console.log("itemArr: ", itemArr);
					this.memberDelete = _.reject(this.user.membershiplist, (v) => _.includes( itemArr.map(e => e.subjectgroupid), v.subjectgroupid));
					console.log("this.memberDelete: ", this.memberDelete);
					this.memberAdd = _.reject(itemArr, (v) => _.includes( this.user.membershiplist.map(e => e.subjectgroupid), v.subjectgroupid));
					console.log("this.memberAdd: ", this.memberAdd);
					this.user.groupslist = filter.map(e => e.firstname).join(', ');
				}
			},
			cancelUser() {
				this.memberDelete = [];
				this.memberAdd = [];
				var index = this.userList.indexOf(this.user);
				this.userList[index] = this.selectedUser;
				this.user = _.cloneDeep(this.newUser);
				this.selectedUser = _.cloneDeep(this.newUser);
				this.selected = null;
			},
			selectUser(item, i) {
				this.fixProps(item);
				this.selectedUser = _.cloneDeep(item);
				this.user = item;
				this.selected = i;
			},
			isSelected(i) {
				return i === this.selected;
			},
			fixProps(item) {
				this.fillProps(item);
				if (item.effectiveenddate == null) {
					Vue.set(item, 'effectiveenddate', moment.utc().add(50, 'years').format('YYYY-MM-DD HH:mm:ss'));
				}
				if (item.effectivestartdate == null) {
					Vue.set(item, 'effectivestartdate', moment.utc().format('YYYY-MM-DD HH:mm:ss'));
				}
				if (item.secondaryemail == null) {
					Vue.set(item, 'secondaryemail', item.email);
				}
				if (item.picture == null) {
					Vue.set(item, 'picture', '');
				}
				if (item.islocked == null) {
					Vue.set(item, 'islocked', false);
				}
				if (item.url == null) {
					Vue.set(item, 'url', '');
				}
				if (item.description == null) {
					Vue.set(item, 'description', '');
				}
			},
			deleteProps(obj) {
				var item = this.cleanProps(obj);
				// Vue.delete(item, 'password');
				// Vue.delete(item, 'isactivated');
				Vue.delete(item, 'totallogincount');
				Vue.delete(item, 'failedlogincount');
				Vue.delete(item, 'invalidpasswordattemptcount');
				Vue.delete(item, 'ispasswordchangerequired');
				Vue.delete(item, 'passwordexpiresat');
				Vue.delete(item, 'lastloginat');
				Vue.delete(item, 'lastpasswordchangeat');
				Vue.delete(item, 'lastauthenticatedat');
				Vue.delete(item, 'lastfailedloginat');

				Vue.delete(item, 'organization');
				Vue.delete(item, 'groups');
				Vue.delete(item, 'membershiplist');
				Vue.delete(item, 'groupslist');
				// Vue.delete(item, 'permissions');
				// Vue.delete(item, 'permissionslist');
				// Vue.delete(item, 'permissionfilter');
				Vue.delete(item, 'groupfilter');
				Vue.delete(item, 'userfilter');
				item.effectivestartdate = moment.utc(this.user.effectivestartdate).toISOString();
				item.effectiveenddate = moment.utc(this.user.effectiveenddate).toISOString();
				return item;
			},
			async deleteUser(item) {
				var deleteConfirm = await this.deleteConfirm();
				if (deleteConfirm) {
					console.log("item.membershiplist: ", item.membershiplist);
					if (item.membershiplist.length > 0) {
						await this.deleteUserMemberships(item);
						await this.deleteUserOnly(item, false);
					} else {
						await this.deleteUserOnly(item, false);
					}
				}
			},
			async deleteUserMemberships(item) {
				item.membershiplist.forEach(async (value, key) => {
					await this.deleteItem(abyss.ajax.subject_memberships, value, false);
				});
			},
			async deleteUserOnly(item, conf) {
				await this.deleteItem(abyss.ajax.subjects, item, conf);
			},
			async addDeleteUserGroups() {
				if (this.memberAdd.length > 0) {
					await this.addBulkItems(abyss.ajax.subject_memberships, this.memberAdd);
				}
				if (this.memberDelete.length > 0) {
					this.memberDelete.forEach(async (value, key) => {
						var item = this.cleanProps(value);
						// Vue.delete(item, 'isactivated');
						var del = await this.deleteItem(abyss.ajax.subject_memberships, value, false);
					});
				}
			},
			async userAction(act) {
				var result = await this.$validator.validateAll();
				if (result) {
					if (act === 'add') {
						this.fixProps(this.user);
						var item = await this.addItem(abyss.ajax.subjects, this.deleteProps(this.user), this.userList);
						if (item) {
							await this.addDeleteUserGroups();
							await this.getPage(1);
							this.$emit('set-state', 'init');
							this.user = _.cloneDeep(this.newUser);
						}
					}
					if (act === 'edit') {
						var item = await this.editItem( abyss.ajax.subjects, this.user.uuid, this.deleteProps(this.user), this.userList );
						if (item) {
							await this.addDeleteUserGroups();
							await this.getPage(1);
							this.$emit('set-state', 'init');
							this.user = _.cloneDeep(this.newUser);
							this.selected = null;
						}
					}
				}
			},
			async getPage(p, d) {
				var subject_directories_list = this.getList(abyss.ajax.subject_directories_list);
				var user_group_list = this.getList(abyss.ajax.user_group_list);
				var subject_memberships = this.getList(abyss.ajax.subject_memberships);
				// var permission_list = this.getList(abyss.ajax.permission_list);
				var user_list = this.getList(abyss.ajax.user_list);
				var organizations_list = this.getList(abyss.ajax.organizations_list);

				// var [directoryOptions, groupOptions, memberOptions, permissionOptions, userList, orgOptions] = await Promise.all([subject_directories_list, user_group_list, subject_memberships, permission_list, user_list, organizations_list]);
				var [directoryOptions, groupOptions, memberOptions, userList, orgOptions] = await Promise.all([subject_directories_list, user_group_list, subject_memberships, user_list, organizations_list]);
				this.directoryOptions = _.orderBy(directoryOptions, [item => item['directoryname'].toLowerCase()], 'asc');
				this.groupOptions = groupOptions;
				this.memberOptions = memberOptions;
				// this.permissionOptions = permissionOptions;
				this.orgOptions = _.orderBy(orgOptions, [item => item['name'].toLowerCase()], 'asc');
				// this.userList = _.map(userList, o => _.extend({permissionfilter: true, groupfilter: true, userfilter: true}, o));
				this.userList = _.map(userList, o => _.extend({groupfilter: true, userfilter: true}, o));
				this.userList.forEach(async (value, key) => {
					var membershiplist = await this.getList(abyss.ajax.subject_memberships_subject + value.uuid);
					if (membershiplist) {
						var groups = _.filter(this.groupOptions, (v) => _.includes( membershiplist.map(e => e.subjectgroupid), v.uuid)) ;
						Vue.set(value, 'membershiplist', membershiplist);
						Vue.set(value, 'groups', groups);
						Vue.set(value, 'groupslist', groups.map(e => e.firstname).join(', '));
					} else {
						Vue.set(value, 'membershiplist', []);
						Vue.set(value, 'groups', []);
						Vue.set(value, 'groupslist', '');
					}
					var org = this.orgOptions.find((item) => item.uuid == value.organizationid );
					Vue.set(value, 'organization', org);
				});
				
				this.paginate = this.makePaginate(this.userList);
				this.preload();
			},
		},
		created() {
			this.$emit('set-page', 'users', 'init');
			this.newUser = _.cloneDeep(this.user);
			this.getPage(1);
		}
	});
});