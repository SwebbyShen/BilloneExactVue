<template>   
    <div style="text-align: right; display: flex; justify-content: flex-end; ">
        <div v-show="isparentcompany">
            <label style="margin-right: 20px;">販社名</label>
            <Dropdown v-model="selectedcompany" :options="companylist" placeholder="全て" filter optionLabel="companyname" style="width: 200px; height: 43px;" @change="companyChange()">
                <template #option="slotProps">
                    <div>{{ slotProps.option.companyname }}</div>
                </template>
            </Dropdown>
        </div>
        <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="height:43px;" text rounded aria-controls="overlay_menu" aria-haspopup="true" />
        <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()"><i class="pi pi-align-justify"></i> メニュー</button>
    </div>
    <div class="form-group row">
        <div class="form-group row col-md-12 mt-2">
            <label for="companyname" class="col-sm-1 col-form-label">
                仕入先
            </label>
            <div class="col-sm-11">
                <span class="p-float-label">
                    <MultiSelect class="form-control" id="companyname" v-model="selectedcreditor" display="chip" :options="creditorlist" placeholder="" filter optionLabel="crdname"
                                 @change="creditorChange()" style="height:43px; padding:0;">
                        <template #option="slotProps">
                            <div>{{ slotProps.option.crdname }}</div>
                        </template>
                        <template #footer>
                            <div class="py-2 px-3">
                                <b>{{ selectedcreditor ? selectedcreditor.length : 0 }}</b> creditor{{ (selectedcreditor ? selectedcreditor.length : 0) > 1 ? 's' : '' }} selected.
                            </div>
                        </template>
                    </MultiSelect>
                    <label for="companyname">仕入先選択</label>
                </span>
            </div>
        </div>

        <DataTable :value="selectedcreditor" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem"
                   removableSort :metaKeySelection="false" v-model:filters="filters" filterDisplay="menu" :loading="loading" scrollable scrollHeight="600px" :rows="10" :paginator="true">
            <template #header>
                <div class="col-sm-12 mt-2" style="text-align:left">
                    <button type="button" class="btn btn-info btn-sm" v-on:click="SaveCreditors()" :style="buttonStyle">{{ saveButtonText }}</button>
                </div>
            </template>
            <Column v-for="(col, columnIndex) of invoicecolumns" showFilterMenu :field="col.field" :header="col.header" :key="col.field + '_' + columnIndex" sortable>
                <template #body="{ data, field, index }">
                    <template v-if="field === 'remark'">
                        <div style="text-align:center">
                            <InputText style="width: 100%" type="text" v-model="selectedcreditor[index].remark" @input="handleInput($event,index)" :class="remarkClasses(selectedcreditor[index].remark)" :id="'inputText_' + index" :value="selectedcreditor[index].remark" />
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="field === 'delete'">
                            <div style="text-align:center">
                                <Checkbox v-model="data.selected" :binary="true" @change="handleRowSelectionChange(data)"/>
                            </div>
                        </template>
                        <template v-else>
                            {{ data[field]}}
                        </template>
                    </template>
                </template>
                <template #filter="{ filterModel, filterCallback}">
                    <InputText v-model="filterModel.value" type="text" @keydown.enter="filterCallback()" class="p-column-filter" placeholder=""/>
                </template>
            </Column>
        </DataTable>
    </div>
    <Toast position="bottom-right" />

    <div class="card flex justify-content-center">

        <Sidebar v-model:visible="showmenu" style="padding:0;" position="right">
            <h2>メニュー</h2>
            <Listbox :options="menulist" optionLabel="name" class="w-full md:w-14rem">
                <template #option="slotProps">
                    <div class="flex align-items-center" @click="menuChange(slotProps.option.redirectroutename)">
                        <div style="padding:10px 0 10px 0px;">{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </Sidebar>
    </div>
</template>

<script>
    import axios from '../../node_modules/axios/index';
    import { ref, onMounted } from 'vue';
    import { useToast } from "primevue/usetoast";
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import { CommonSetting } from "/service/CommonSetting.js";

    export default {
        beforeRouteLeave(to, from, next) {
            if (this.errorcount > 0 || this.remarkchange == true) {
                if (this.remarkchange == true) {
                    const inputElement = document.getElementById("inputText_" + this.alertindex);
                    this.$nextTick(() => {
                        inputElement.focus();
                        inputElement.classList.add("p-invalid");
                        inputElement.classList.add("p-focus");
                    });
                }
                const answer = window.confirm('保存されていない記録があります。画面遷移を続けてもよろしいですか。')
                if (!answer) {
                    next(false);
                } else {
                    next();
                }
            }
            else {
                next();
            }
        },
        setup() {
            onMounted(() => {
                loading.value = true;
            });
            const loading = ref(false);
            const filters = ref();
            const initFilters = () => {
                filters.value = {
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                    crdnr: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    crdcode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    crdname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    delete: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    remark: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                };
            };
            initFilters();
            const showmenu = ref(false);
            const toast = useToast();            
            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/wiki/spaces/ISJP/pages/819691688?parentProduct=JSM-Portal&parentProductContentContainerId=10238&initialAllowedFeatures=disable-login-flow.disable-share&locale=ja-JP#%E4%BB%95%E5%85%A5%E5%85%88%E8%A8%AD%E5%AE%9A%E7%94%BB%E9%9D%A2', '_blank');
                document.body.click();
            };
            const errortoast = (msg) => {
                toast.add({ severity: 'error', summary: 'エラー', detail: msg, life: 3000 });//エラー発生時に、表示するToast
            };
            const infotoast = (msg) => {
                toast.add({ severity: 'info', summary: 'info', detail: msg, life: 3000 });//情報表示時に、表示するToast
            };
            
            return {
                filters, loading, showmenu, errortoast, infotoast, CommonSetting, helpMenu
            };
        },
        data() {
            return {
                comments: null,
                menulist: null,
                isDropdownDisabled: true,
                companylist: null,
                selectedcompany: null,
                selectedcreditor: null,//仕入先選択用
                selectedcreditorList: null,//GetCreditorSettingList()のデータを格納
                companyName: "",//仕入先選択用
                creditorlist: null,
                invoicecolumns: [],//表示されるテーブルのヘッダー設定データ
                datacount: null,
                isparentcompany: false, //親会社であるかを判断
                accesstoken: null,
                savedremark: null,
                errorcount: 0,
                remarkchange: false,//備考の修正があるかどうか
                alertindex: null,//修正された備考の行のindex
                saveButtonText: '保存',//ボタンのテキスト
                buttonStyle: {//ボタンのスタイル
                    color: 'black',
                },
            };
        },
        methods: {
            handleInput(event, index) {
                this.remarkchange = true;
                this.alertindex = index;//修正があった行のindexを保存
                this.saveButtonText = '保存 *';
                this.buttonStyle.color = 'red';
            },

            defaultsetting() {
                CommonSetting.getAllMenu(this.$auth.getCurrentUser().username, this.accesstoken).then((data) => (this.menulist = data));
            },
            menuChange(routeName) {
                if (routeName == "manual") {
                    window.open('https://teraoka.atlassian.net/servicedesk/customer/portal/26/article/840106051', '_blank');
                }
                else {
                    this.$router.push({ name: routeName });
                    this.showmenu = false;
                }
            },
            setTableHeader() {
                this.invoicecolumns = [
                    //{ field: 'crdnr', header: 'crdnr' },
                    //{ field: 'crdcode', header: 'crdcode' },
                    { field: 'crdname', header: '仕入先' },
                    { field: 'delete', header: '除外対象' },
                    { field: 'remark', header: '備考' }, 
                ];
            },

            companyChange() {
                this.isDropdownDisabled = true;
                if (this.selectedcompany == null) {
                    this.operationcompanycode = "";
                } else {
                    this.operationcompanycode = this.selectedcompany.companycode;
                    this.getCreditorList();//仕入先リストを更新
                };
                this.operationcompanycode = this.selectedcompany.companycode;
                CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                this.$router.push({
                    name: 'companysettings',
                    params: { companycode: this.operationcompanycode }
                });
            },
            
            handleRowSelectionChange(row) {
                if (!row.selected) {
                    if (!confirm("除外設定を取り消しますか？")) {
                        row.selected = true;
                        return;
                    } else {
                        const index = this.selectedcreditor.findIndex(item => item === row);
                        this.DeleteCreditorSetting(index);
                        if (index !== -1) {
                            this.selectedcreditor.splice(index, 1);
                        }
                    }
                    
                }
            },

            remarkClasses(remark) {
                return {
                    'p-invalid': !remark || remark.trim() === '',
                };
            },

            SaveCreditors() {
                var successcount = 0;
                this.errorcount = 0;
                this.remarkchange = false;
                if (this.selectedcreditor == null || this.selectedcreditor == "") {
                    return this.errortoast("仕入先を選択してください。");
                }

                for (const [index] of this.selectedcreditor.entries()) {
                    if (this.selectedcreditor[index].remark == null || this.selectedcreditor[index].remark == "") {
                        this.errorcount++;
                        const inputElement = document.getElementById("inputText_" + index);
                        this.$nextTick(() => {
                            inputElement.focus();
                            inputElement.classList.add("p-invalid");
                            inputElement.classList.add("p-focus");
                        });
                    }
                }

                if (this.errorcount > 0) {
                    this.errortoast("コメントを入力してください。エラー件数：" + this.errorcount);
                }

                else {
                    //const selectedCreditorCopy = [...this.selectedcreditor];
                    for (const [index] of this.selectedcreditor.entries()) {
                        console.log(this.selectedcreditor);
                        console.log(this.savedremark);

                        if (index + 1 > this.savedremark.length) {
                            this.SaveCreditorSetting(index, this.selectedcreditor[index].remark);
                            successcount++
                        }

                        else {
                            if (this.savedremark[index].remark != this.selectedcreditor[index].remark) {
                                this.SaveCreditorSetting(index, this.selectedcreditor[index].remark);
                                successcount++
                            }
                        }
                    }
                    if (successcount > 0) {
                        this.infotoast(successcount + "件の保存に成功しました。");
                        this.saveButtonText = '保存';
                        this.buttonStyle.color = 'black';
                        this.getCreditorList();
                    }
                    else {
                        this.infotoast( "全ての記録は保存済みです。");
                    }
                }                
            },

            //仕入先が切り替えたら
            creditorChange() {
                this.isDropdownDisabled = true;
                this.selectedcreditor.forEach(item => {
                    item.selected = true;
                });
            },

            //仕入先リストの取得
            getCreditorList() {
                var params = {
                    'companycode': this.operationcompanycode
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetCreditorListByCompany'
                    , params).then(
                        response => (
                            this.creditorlist = JSON.parse(response.data),
                            this.GetCreditorSettingList()
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //CreditorSettingListデータの取得
            GetCreditorSettingList() {
                var self = this;
                var params = {
                    "companycode": this.operationcompanycode,
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetCreditorSettingList'
                    , params).then(
                        function (response) {
                            self.selectedcreditor = JSON.parse(response.data);
                            var ilength = self.selectedcreditor.length;//初期lengthの取得
                            self.selectedcreditor.forEach(newItem => {
                                const existingItem = self.creditorlist.find(item => item.crdname === newItem.crdname);
                                if (existingItem) {
                                    existingItem.remark = newItem.remark;//備考の更新
                                    self.selectedcreditor.push(existingItem);
                                    existingItem.selected = true;
                                }
                            });                            
                            self.selectedcreditor.splice(0, ilength);//初期値の削除
                            self.savedremark = JSON.parse(response.data);//備考の一時保存
                            self.loading = false;
                        }
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //DeleteCreditorSettingデータの取得
            DeleteCreditorSetting(index) {
                var self = this;
                var params = {
                    "updateby": this.$auth.getCurrentUser().username,
                    "creditorlist": [{
                        "crdnr": this.selectedcreditor[index].crdnr,
                        "crdcode": this.selectedcreditor[index].crdcode,
                        "crdname": this.selectedcreditor[index].crdname,
                        "companycode": this.selectedcreditor[index].companycode,
                        "remark": this.selectedcreditor[index].remark,
                        "selected": this.selectedcreditor[index].selected
                    }],
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/DeleteCreditorSetting'
                    , params).then(
                            this.infotoast("正常に除外されました。")
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //DeleteCreditorSettingデータの取得
            SaveCreditorSetting(index,text) {
                var self = this;
                var params = {
                    "updateby": this.$auth.getCurrentUser().username,
                    "creditorlist": [{
                        "crdnr": this.selectedcreditor[index].crdnr,
                        "crdcode": this.selectedcreditor[index].crdcode,
                        "crdname": this.selectedcreditor[index].crdname,
                        "companycode": this.selectedcreditor[index].companycode,
                        "remark": text,
                        "selected": this.selectedcreditor[index].selected
                    }],
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/SaveCreditorSetting'
                    , params).then(
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            gotoMenu() {
                this.showmenu = true;
                CommonSetting.restyleSideBar();
            },
        },
        mounted() {
            this.$auth.accessToken().then((accesstoken) => {
                this.accesstoken = accesstoken;
                CommonSetting.checkIfParentCompany(this.$auth.getCurrentUser().username, this.accesstoken).then((data) => {
                this.isparentcompany = data.IsParent;
                this.currentcompanycode = data.CurrentCompanyCode;
                    CommonSetting.getCompanyList(this.currentcompanycode, this.accesstoken).then((cmplist) => {//販社リストを取得
                    this.companylist = cmplist;
                        if (this.isparentcompany) {//親会社所属のユーザーである場合、リスト内の先頭会社をデフォルトとしてセット
                            if (this.companycode != undefined) {//CompanyCodeがURLで指定されている場合
                                var urlselectdcompany = this.companylist.filter(obj => {
                                    return obj.companycode === this.companycode
                                });
                                //CompanyCodeがURLで指定された販社をデフォルトでセット
                                this.operationcompanycode = urlselectdcompany[0].companycode;
                                this.selectedcompany = urlselectdcompany[0];
                                CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                            } else { //CompanyCodeがURLで指定されない場合、先頭の販社をデフォルトでセット
                                //this.operationcompanycode = this.companylist[0].companycode;
                                //this.selectedcompany = this.companylist[0];
                                this.operationcompanycode = localStorage.getItem('operationcompanycode');
                                if (this.operationcompanycode == undefined) { this.operationcompanycode = this.companylist[0].companycode; }
                                const index = this.companylist.findIndex(c => c.companycode === this.operationcompanycode);
                                this.selectedcompany = this.companylist[index];
                                this.$router.push({
                                    name: 'companysettings',
                                    params: { companycode: this.operationcompanycode }
                                });
                            }
                    }
                    else
                    {
                        this.operationcompanycode = this.currentcompanycode;
                    }
                        this.defaultsetting();
                        this.getCreditorList();
                        this.setTableHeader(this.invoicecolumns);
                    });
                });
            });
        },
    };
</script>

<style>

    * {
        box-sizing: border-box
    }

    .flex-container {
        display: flex;
        align-items: center;
    }
    .spacer {
        margin: 0 5px;
    }

</style>
