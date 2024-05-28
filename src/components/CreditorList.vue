<template>
    <div class="outer-container">
        <div class="row">
            
            <div class="col-md-2">
                <div class="tab">
                    <div class="form-group row col-md-20">
                        <div class="justify-content-center">
                            <label for="companyname" class="col-sm-1 col-form-label">
                              仕入先
                            </label>
                        </div>                        
                        <div class="col-sm-20">
                            <Dropdown class="form-control" id="companyname" v-model="selectedcreditor" :options="creditorlist" placeholder="" filter optionLabel="crdname"
                                      @change="creditorChange()" style="height:43px; padding:0;" showClear>
                                <template #option="slotProps">
                                    <div>{{ slotProps.option.crdname }}</div>
                                </template>
                            </Dropdown>
                        </div>
                    </div>
                    <button v-for="invoice in invoices"
                            :key="invoice.description"
                            :class=" {tablinks: true, active: invoice.description === currentInvoice}"
                            @click="openInvoice(invoice.description, invoice.invoiceclosedate)">
                        <div style=" flex: 1; text-align: center;">
                            {{ invoice.description }}
                        </div>
                        <span class="p-ink" role="presentation" aria-hidden="true" style="height: 80px; width: 80px; top: -18.9375px; left: 6.1875px;"></span><!--クリックデザイン-->
                    </button>
                </div>
            </div>

            <div class="col-md-10" style="padding:0;">
                <div v-for="invoice in invoices" :key="invoice.description" v-show="invoice.description === currentInvoice" class="tabcontent">

                    <div class="col-sm-12 mt-2 d-flex justify-content-between" style="text-align:right">
                        <div style="flex: 1; text-align: center;">
                            <h3>{{ invoice.description }}</h3>
                        </div>
                        <div v-show="isparentcompany" style="margin-right: 20px;">
                            <label style="margin-right: 20px;">販社名</label>
                            <Dropdown :disabled="isDropdownDisabled" v-model="selectedcompany" :options="companylist" placeholder="全て" filter optionLabel="companyname" style="width: 200px; height: 43px;" @change="companyChange(invoice.description, invoice.invoiceclosedate)">
                                <template #option="slotProps">
                                    <div>{{ slotProps.option.companyname }}</div>
                                </template>
                            </Dropdown>
                        </div>
                        <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="height:43px;" text rounded aria-controls="overlay_menu" aria-haspopup="true" />                       
                        <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()"><i class="pi pi-align-justify"></i> メニュー</button>
                    </div>
                    <DataTable :value="currentInvoiceData" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem"
                               removableSort :metaKeySelection="false" style="height: 95.69%"
                               v-model:filters="filters" filterDisplay="menu" :loading="loading" scrollable scrollHeight="600px" :rows="10" :paginator="true">
                        <template #header>
                            <!--<div class="form-group row col-md-7">
                                <label class="col-sm-1 col-form-label">請求日</label>
                                <Calendar v-model="invoiceDateFrom" :dateFormat="'yy-mm-dd'" showIcon style="width: 250px; height:43px;" />
                                <Calendar v-model="invoiceDateTo" :dateFormat="'yy-mm-dd'" showIcon style="width: 250px; height: 43px;" />
                                <div class="col-sm-3 mt-1" style="text-align:left;">
                                    <button type="button" class="btn btn-primary" @click="openInvoiceSearch(invoice.description, invoice.invoiceclosedate)" style="margin-right: 3px;">検索</button>
                                    <button type="button" class="btn btn-warning" @click="clearDate">クリア</button>
                                </div>
                            </div>-->
                            <div class="col-sm-12 mt-2" style="text-align:left">
                                <div v-if="dataloading == true" class="flex-container">                                    
                                    <div><Knob v-model="value" :size="40" valueTemplate="{value}%" valueColor="MediumTurquoise" readonly/></div>
                                    <div class="spacer"> </div>
                                    <div><span>{{ statusText }}</span></div>
                                </div>
                                <div v-else class="flex-container">
                                    <div><Knob v-model="value" :size="40" valueTemplate="{value}%" valueColor="MediumTurquoise" readonly /></div>
                                    <div class="spacer"> </div>
                                    <div><span>{{ statusText }}</span></div>
                                </div>
                            </div>
                            <div class="col-sm-12 mt-2" style="text-align:left">
                                <span>
                                    検索結果数: {{ datacount }}
                                </span>
                            </div>
                        </template>
                        <Column v-for="(col, index) of invoicecolumns" :showFilterMenu="(col.field == 'registerstatus' ? false : true)" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="(col.field == 'registerstatus' ? false : true)">
                            <!--:showFilterMenu="(col.field == 'registerstatus' ? false : true)"-->
                            <template #body="{ data, field }">
                                <template v-if="field === 'registerstatus'">
                                    <button type="button" class="btn btn-info btn-sm" v-on:click="fncInvoiceDetail(data.crdcode)">事前登録</button>
                                </template>
                                <template v-else>
                                    <template v-if="field === 'receivedcount'">
                                        <div>
                                            <div v-if="data[field] == ''">
                                                <i class="fas fa-spinner fa-spin"></i>
                                                <span>{{ data[field] }}</span>
                                            </div>
                                            <div v-else>
                                                <span>{{ data[field] }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <span>{{ data[field] }}</span>
                                    </template>
                                </template>
                            </template>
                            <template #filter="{ filterModel, filterCallback}">
                                <InputText v-if="col.field !== 'registerstatus'" v-model="filterModel.value" type="text" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>

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
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import { CommonSetting } from "/service/CommonSetting.js";
    import "primevue/resources/themes/saga-blue/theme.css";
    import "primevue/resources/primevue.min.css";
    import "primeicons/primeicons.css";

    export default {
        setup() {
            onMounted(() => {
                loading.value = false;
            });
            const loading = ref(false);
            const filters = ref();
            const initFilters = () => {
                filters.value = {
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                    crdnr: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    crdcode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    crdname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    receivedcount: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    registerstatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },                    
                };
            };
            initFilters();

            const showmenu = ref(false);            
            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/wiki/spaces/ISJP/pages/819691688?parentProduct=JSM-Portal&parentProductContentContainerId=10238&initialAllowedFeatures=disable-login-flow.disable-share&locale=ja-JP#%E4%BB%95%E5%85%A5%E5%85%88%E4%B8%80%E8%A6%A7%E7%94%BB%E9%9D%A2', '_blank');
                document.body.click();
            };
            return {
                filters, loading , showmenu, helpMenu
            };
        },
        data() {

            return {
                menulist: null,
                isDropdownDisabled: false,
                currentInvoice: null,
                invoices: [],//GetInvoiceCloseDateList()のデータを格納
                CreditorList: [],//GetCreditorListByInvoiceCloseDate()のデータを格納
                CountList: [],//GetReceiptCountByCreditor()のデータを格納
                invoicecloseDate: null,//GetInvoiceCloseDateList()のinvoicecloseDateを格納
                invoiceDateFrom: CommonSetting.defaultStartDate(),//デフォルトは今日から6ヶ月前
                invoiceDateTo: CommonSetting.defaultEndDate(),//デフォルトは今日から6ヶ月後
                currentcompanycode: null,
                operationcompanycode: null,
                companylist: null,
                selectedcompany: null,               
                selectedcreditorcode: null,//GetInvoiceCloseDateList()入力用
                selectedcreditor: null,//仕入先選択用
                companyName: "",//仕入先選択用
                pattern: null,
                creditorlist: null,
                abortController: null,
                description: null,//GetInvoiceCloseDateList()description用
                invoicecolumns: [],//表示されるテーブルのヘッダー設定データ
                datacount: null,
                cachedatacount: {},
                invoiceDataCache: {}, // Cacheを格納
                defaultinvoicedate: "20",
                isparentcompany: false, //親会社であるかを判断
                accesstoken: null,
                statusText: "",
                dataloading: true,
                value: 0,
            };
        },
        created() {
            this.abortController = new AbortController();
        },
        computed: {
            currentInvoiceData() {
                return this.invoiceDataCache[this.currentInvoice];
            },
        },

        methods: {
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
            cancelAsyncOperation() {
                if (this.abortController) {
                    this.abortController.abort();
                }
                this.abortController = new AbortController();
            },

            setTableHeader() {
                this.invoicecolumns = [
                    //{ field: 'crdnr', header: 'crdnr' },
                    //{ field: 'crdcode', header: 'crdcode' },
                    { field: 'crdname', header: '仕入先' },
                    { field: 'receivedcount', header: '受領済アイテム数' },
                    { field: 'registerstatus', header: '' },
                ];
            },

            //仕入先が切り替えたら
            creditorChange() {
                this.cancelAsyncOperation();//前の非同期処理を止まる                                
                if (this.selectedcreditor == null) {
                    this.selectedcreditorcode = "";
                    this.pattern = "nocreditorcode";//仕入先が空の場合はデフォルト値に返す
                } else {
                    this.selectedcreditorcode = this.selectedcreditor.crdcode;
                    this.pattern = "creditorselected";//仕入先が選択された場合
                }
                this.GetInvoiceCloseDateList(this.pattern);
            },

            //仕入先リストの取得
            getCreditorList() {
                var params = {
                    'companycode': this.operationcompanycode
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetCreditorListByCompany'
                    , params).then(
                        response => (
                            this.creditorlist = JSON.parse(response.data)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            openInvoice(description, invoiceclosedate) {
                this.cancelAsyncOperation();
                this.datacount = null;
                this.invoiceDateFrom = this.sixMonthsAgo;
                this.invoiceDateTo = this.sixMonthsLater;
                //this.abortController = new AbortController();
                //if (this.invoiceDataCache[description]) {//キャシューがある場合は、キャシューを表示
                //    this.currentInvoice = description;
                //    this.datacount = this.cachedatacount[description];
                //}
                //else {//キャシューがない場合は、データをダウンロード
                    //this.loading = true;
                    //this.isDropdownDisabled = true;
                    this.GetCreditorListByInvoiceCloseDate(invoiceclosedate, description);
                    this.currentInvoice = description;
                /*}*/
            },
            openInvoiceSearch(description, invoiceclosedate) {
                this.cancelAsyncOperation();
                this.datacount = null;
                this.loading = true;
                this.GetCreditorListByInvoiceCloseDate(invoiceclosedate, description);
                this.currentInvoice = description;
            },

            //e.g.invoiceclosedate="15"、description="請求締日(15)"の取得
            GetInvoiceCloseDateList(pattern) {
                var self = this;                
                var params = {
                    'companycode': this.operationcompanycode,
                    'creditorcode': this.selectedcreditorcode,
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceCloseDateList'
                    , params).then(
                        function (response) {
                            self.invoices = JSON.parse(response.data);
                            self.datacount = null;
                                //self.loading = true;
                            if (pattern == "creditorselected") {
                                self.defaultinvoicedate = self.invoices[0].invoiceclosedate,
                                    self.description = self.invoices[0].description,                                    
                                    self.GetCreditorListByInvoiceCloseDate(self.defaultinvoicedate, self.description),
                                    self.currentInvoice = self.description//デフォルト的に唯一の請求締日を選択
                            }

                            else if (pattern == "nocreditorcode") {//デフォルト的に請求締日(20)が表示される
                                    self.defaultinvoicedate = "20",
                                    self.description = "請求締日(20)",
                                    self.GetCreditorListByInvoiceCloseDate(self.defaultinvoicedate, self.description)
                            }
                            else {
                                //console.log(self.description)
                            }
                        }
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            GetReceiptCountByCreditor(creditorinfo, loopindex,description) {
                var self = this;

                if (loopindex > self.CreditorList.length)
                {
                    this.statusText = ` 全てのデータ取得が完了しました。`;
                    this.dataloading = false;
                    //self.isDropdownDisabled = false;
                    //self.invoiceDataCache[description] = self.CreditorList;//キャシューの保存
                    //self.cachedatacount[description] = self.datacount;
                    return;
                }
                

                var params = {
                    'companycode': self.operationcompanycode,
                    'invtobereceivedfrom': CommonSetting.formatDate(self.invoiceDateFrom),
                    'invtobereceivedto': CommonSetting.formatDate(self.invoiceDateTo),
                    'creditorno': creditorinfo.crdnr,
                };

                axios.post('https://billoneexactapi.azurewebsites.net/api/GetReceiptCountByCreditor', params, {
                    
                    signal: this.abortController.signal
                }).then(response => {
                    var receivedcount = JSON.parse(response.data);

                    if (receivedcount.length == 0) {
                        creditorinfo.receivedcount = "0";
                    } else {
                        creditorinfo.receivedcount = receivedcount[0].receivedcount;
                    }
                    self.statusText = ' データ取得中(' + loopindex + '/' + self.CreditorList.length + '): ' + creditorinfo.crdname;
                    self.value = Math.floor((loopindex / self.CreditorList.length) * 100);//プロセスパーセントの計算
                    self.GetReceiptCountByCreditor(self.CreditorList[loopindex++], loopindex++);
                    
                    //console.log(self.value);

                }).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //datatableのデータの取得
            GetCreditorListByInvoiceCloseDate(invoiceclosedate, description) {
                //this.isDropdownDisabled = false;
                var self = this;
                if (invoiceclosedate == null) { invoiceclosedate ="" }
                var params = {
                    "companycode": this.operationcompanycode,
                    "invtobereceivedfrom": CommonSetting.formatDate(this.invoiceDateFrom),
                    "invtobereceivedto": CommonSetting.formatDate(this.invoiceDateTo),
                    "invoiceclosedate": invoiceclosedate,
                    "creditorcode": this.selectedcreditorcode,
                };
                //console.log(invoiceclosedate);
                //console.log(description);
                //console.log(this.accesstoken);
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetCreditorListByInvoiceCloseDate'
                    , params,
                    {                       
                        signal: this.abortController.signal
                    }).then(
                        function (response) {
                            self.CreditorList = JSON.parse(response.data);
                            self.datacount = self.CreditorList.length;                                                        
                            self.loading = false;
                            if (self.CreditorList.length > 0) {
                                self.GetReceiptCountByCreditor(self.CreditorList[0], 0, description);
                            }
                            else {
                                self.cancelAsyncOperation();
                                self.statusText = "";
                                self.statusText = ` 全てのデータ取得が完了しました。`;
                                self.value = Math.floor(100);
                            }
                            self.invoiceDataCache[description] = self.CreditorList;//キャシューの保存
                            self.cachedatacount[description] = self.datacount;
                        }
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            fncInvoiceDetail(crdcode) {
                window.location.href = "/invoicedetail/invoiceid/NaN/companycode/" + this.operationcompanycode + "/invoiceamount/0/creditorcode/" + crdcode + "/invoiceregisterdate/NaN/billoneno/NaN";
            },

            companyChange(description, invoiceclosedate) {
                this.cachedatacount = {};//一回切り替えたらキャシューは削除される
                this.invoiceDataCache = {};//一回切り替えたらキャシューは削除される

                if (this.selectedcompany == null) {
                    this.operationcompanycode = "";
                    
                } else {
                    this.operationcompanycode = this.selectedcompany.companycode;
                    CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                    this.$router.push({
                        name: 'companylist',
                        params: { companycode: this.operationcompanycode }
                    });
                    this.getCreditorList();//仕入先リストを更新
                    this.GetInvoiceCloseDateList();
                }
                
                this.openInvoiceSearch(description, invoiceclosedate);//切り替えたら再検索
                this.currentInvoice = description;
            },   
            gotoMenu() {
                this.showmenu = true;
                CommonSetting.restyleSideBar();
            },

            clearDate() {
                this.invoiceDateFrom = null;// 日付をクリア
                this.invoiceDateTo = null;// 日付をクリア
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
                        //this.operationcompanycode = this.companylist[0].companycode;
                        //this.selectedcompany = this.companylist[0];
                        this.operationcompanycode = localStorage.getItem('operationcompanycode');
                        if (this.operationcompanycode == undefined) { this.operationcompanycode = this.companylist[0].companycode; }
                        /*console.log(localStorage.getItem('operationcompanycode'));*/
                        const index = this.companylist.findIndex(c => c.companycode === this.operationcompanycode);
                        this.selectedcompany = this.companylist[index];
                        this.$router.push({
                            name: 'companylist',
                            params: { companycode: this.operationcompanycode }
                        });
                        this.loading = false;
                    }
                    else {
                        this.operationcompanycode = this.currentcompanycode;
                        }                        
                        this.defaultsetting();
                        this.getCreditorList();
                        this.GetInvoiceCloseDateList();
                        this.setTableHeader(this.invoicecolumns);
                        this.openInvoice("請求締日(20)", this.defaultinvoicedate);
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
    .outer-container {
        font-family: "Lato", sans-serif;
        overflow: hidden;
    }

    .tab {
        /*float: left;*/
        position: relative;
        padding: 0;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
        width: 100%;
        height: 100vh;
        white-space: nowrap;
    }
    
    .tab button {
        display: block;
        background-color: inherit;
        color: black;
        padding: 22px 16px;
        width: 100%;
        border: none;
        outline: none;
        text-align: left;
        cursor: pointer;
        transition: 0.3s;
        font-size: 17px;
        font-weight: 500;
        min-width:4rem;

    }

    .tab button:hover {
        background-color: #ddd;

    }

    .tab button.active {
        background-color: #808080;

    }

    .tabcontent {
        position: relative;
        /*padding: 0;*/
        width: 100%;
        height: 100vh;
        border: 1px solid #dee2e6;
    }

</style>
