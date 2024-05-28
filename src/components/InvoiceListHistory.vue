<link rel="stylesheet" href="primevue/resources/themes/saga-blue/theme.css" />
<link rel="stylesheet" href="primevue/resources/primevue.min.css" />
<link rel="stylesheet" href="primeicons/primeicons.css" />

<template>
    <div id="invoicesearchinfo">
        <div style="display: flex; justify-content: space-between;">
            <div class="form-group row" @keyup.enter="searchInvoices" v-show="showsearchbox">
                <div class="form-group row col-md-7">
                    <label for="colFormLabel" class="col-sm-3 col-form-label">
                        請求日
                    </label>
                    <div class="col-sm-4">
                        <Calendar v-model="invoiceDateFrom" :maxDate="invoiceDateTo" showButtonBar :dateFormat="'yy-mm-dd'" showIcon style="width: 500px;height:43px;" />
                    </div>
                    <div class="col-sm-4">
                        <Calendar v-model="invoiceDateTo" :minDate="invoiceDateFrom" showButtonBar :dateFormat="'yy-mm-dd'" showIcon style="width: 500px; height: 43px;" />
                    </div>
                </div>
                <div v-show="isparentcompany" class="form-group row col-md-5">
                    <label for="colFormLabel" class="col-sm-3 col-form-label">
                        販社名
                    </label>
                    <div class="col-sm-1 flex align-items-center">
                        <Dropdown v-model="selectedcompany" :options="companylist" placeholder="全て" filter optionLabel="companyname" style="height:43px;" :showClear="true" @change="companyChange">
                            <template #option="slotProps">
                                <div>{{ slotProps.option.companyname }}</div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="form-group row col-md-7">
                    <div class="col-sm-3 mt-2">
                    </div>
                    <div class="col-sm-4 mt-2" style="text-align:left;">
                        <button type="button" class="btn btn-primary" @click="searchInvoices" style="margin-right: 3px;">検索</button>
                        <button type="button" class="btn btn-warning" @click="clearSearch">クリア</button>
                    </div>
                </div>
            </div>
            <div style="text-align: right;">
                <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="margin-left:5px;height:43px;" text rounded aria-controls="overlay_menu" aria-haspopup="true" />
                <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()"><i class="pi pi-align-justify"></i> メニュー</button>
            </div>
        </div>
            <TabView class="tabview-custom">
                <TabPanel>
                    <template #header>
                        <button type="button" class="btn btn-outline-primary" v-on:click="showsearchbox = !showsearchbox"><font-awesome-icon :icon="['fas', 'eye']" style="padding:0" /> {{(showsearchbox ? '検索条件を非表示' : '検索条件を表示')}} </button>
                    </template>
                    <div class="row">
                        <DataTable :value="invoicedata" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem"
                                   removableSort v-model:selection="selected_invoicelines" :metaKeySelection="false"
                                   v-model:filters="filters" filterDisplay="menu" :loading="loading" scrollable scrollHeight="650px">
                            <template #header>
                                <div style="text-align:left">
                                    <span>
                                        検索結果数: {{ datacount }} 件
                                    </span>
                                </div>
                                <div style="text-align:left"></div>
                            </template>
                            <Column v-for="(col, index) of invoicecolumnsselected" :showFilterMenu="(col.field == 'topic' ? false : true)" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="(col.field == 'registerstatus' ? false : true) ">
                                <template #body="{ data, field }">
                                    <template v-if="field === 'datatype'">
                                        <template v-if="data['datatype'] === 'エラー'">
                                            <InlineMessage severity="error">{{ data[field]}}</InlineMessage>
                                        </template>
                                        <template v-else>
                                            <InlineMessage severity="success">{{ data[field]}}</InlineMessage>
                                        </template>
                                    </template>
                                    <template v-else-if="field === 'message'">
                                        <template v-if="data['datatype'] === 'エラー'">
                                            <InlineMessage severity="error">{{ data[field] }}</InlineMessage>
                                        </template>
                                        <template v-else>
                                            <InlineMessage severity="success">{{ data[field] }}</InlineMessage>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <span>{{ data[field]}}</span>
                                    </template>
                                </template>
                                <template #filter="{ filterModel, filterCallback, field}">
                                    <template v-if="field === 'datatype'">
                                        <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="datatype" placeholder="" class="p-column-filter"></Dropdown>
                                    </template>
                                    <template v-else>
                                        <InputText v-model="filterModel.value" type="text" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="" />
                                    </template>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>
        </div>

    <div class="card flex justify-content-center">
        <Sidebar v-model:visible="showmenu" style="padding:0;" position="right">
            <h2>メニュー</h2>
            <Listbox :options="menulist" optionLabel="name" class="w-full md:w-14rem">
                <template #option="slotProps">
                    <div class="flex align-items-center" @click="menuChange(slotProps.option.redirectroutename)">
                        <!--$router.push({ name: slotProps.option.redirectroutename })-->
                        <div style="padding:10px 0 10px 0px;">{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </Sidebar>
    </div>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    import axios from '../../node_modules/axios/index';
    import { useToast } from "primevue/usetoast";
    import { ref } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import "primevue/resources/themes/saga-blue/theme.css";
    import "primevue/resources/primevue.min.css";
    import "primeicons/primeicons.css";
    import { CommonSetting } from "/service/CommonSetting.js";
    
    export default {
        setup() {           
            const toast = useToast();
            const filters = ref();
            const initFilters = () => {
                filters.value = {
                global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                billoneno: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                invoiceid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                journalname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                creditorname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                invoicedate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                origininvoiceamt: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                invoiceamount: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },

                message: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                datatype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                importdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                topic: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                };
            };
            initFilters();
            const errortoast = (msg) => {
                toast.add({ severity: 'error', summary: 'エラー', detail: msg, life: 3000 });//エラー発生時に、表示するToast
            };
            const infotoast = (msg) => {
                toast.add({ severity: 'info', summary: 'info', detail: msg, life: 3000 });//情報表示時に、表示するToast
            };
            const statuses = ref(['受入アイテム登録', '一時登録中']);
            const datatype = ref(['成功', 'エラー']);
            const showmenu = ref(false);
           
            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/wiki/spaces/ISJP/pages/819691688?parentProduct=JSM-Portal&parentProductContentContainerId=10238&initialAllowedFeatures=disable-login-flow.disable-share&locale=ja-JP#BillOne%E8%AB%8B%E6%B1%82%E6%9B%B8%E4%B8%80%E8%A6%A7', '_blank');
                document.body.click();
            };
            return {
                errortoast, filters, infotoast, statuses, showmenu, CommonSetting, helpMenu, datatype
            };
        },
        computed: {
            filterText: {
                get() {
                    return this.$store.state.filterText;
                },
                set(value) {
                    this.$store.commit('setFilterText', value); 
                },
            }          
        },
        props: ["invoiceid", "datastatus","companycode"],//URLから取得
        data() {
            return {
                menulist: null,
                showsearchbox: true,
                billonenofrom: null,
                billonenoto: null,
                companyName: null,
                invoiceDateFrom: null,
                invoiceDateTo: null,
                invoiceAmountFrom: null,
                invoiceAmountTo: null,
                searchdatastatus: "",
                finalregisterStatus: null,
                registerStatus: [],
                invoicecolumns: [],//表示されるテーブルのヘッダー設定データ
                invoicecolumnsselected: [],
                invoicedata: null,
                columns: [],              
                datacount: null,
                selected_invoicelines: [], //タブ内で表示されるテーブルにて、クリック（選択）した行を記録する
                loading: ref(true),
                creditorlist: null,
                selectedcreditor: null,
                currentcompanycode: null,
                operationcompanycode:null,
                companylist: null,
                selectedcompany: null,
                currencycolumns: [],//通貨型の列名を格納
                isparentcompany: false, //親会社であるかを判断
                accesstoken: null
            }
        },       
        mounted() {
            this.$auth.accessToken().then((accesstoken) => {               
                this.accesstoken = accesstoken;
                if (this.datastatus != undefined && this.companycode != undefined) {//Dashboardより遷移された場合                   
                    this.searchdatastatus = this.datastatus;
                    this.operationcompanycode = this.companycode;
                    this.showsearchbox = false;
                    this.defaultsetting();
                    this.getInvoiceListHistory();
                    this.setTableHeader(this.columns);
                    this.getCreditorList();
                    return;
                }
                this.invoiceDateFrom = CommonSetting.OneMonthBefore();//検索条件の「From」を「本日 - 1ヶ月」でセット
                this.invoiceDateTo = CommonSetting.Today();//検索条件の「To」を「本日」でセット   
                CommonSetting.checkIfParentCompany(this.$auth.getCurrentUser().username, this.accesstoken).then((data) => {
                    this.isparentcompany = data.IsParent;
                    this.currentcompanycode = data.CurrentCompanyCode;
                    CommonSetting.getCompanyList(this.currentcompanycode, this.accesstoken).then((cmplist) => {//販社リストを取得
                        this.companylist = cmplist;
                        if (this.isparentcompany) {//親会社所属のユーザーである場合、リスト内の先頭会社をデフォルトとしてセット
                            /*this.operationcompanycode = this.companylist[0].companycode;*/
                            this.operationcompanycode = localStorage.getItem('operationcompanycode');
                            console.log(localStorage.getItem('operationcompanycode'));
                            const index = this.companylist.findIndex(c => c.companycode === this.operationcompanycode);
                            this.selectedcompany = this.companylist[index];
                            this.$router.push({
                                name: 'historyinvoicelist',
                                params: {companycode: this.operationcompanycode }
                            });
                            //this.selectedcompany = this.companylist[0];
                        } else {
                            this.operationcompanycode = this.currentcompanycode;
                        }
                        this.defaultsetting();
                        this.getInvoiceListHistory();
                        this.setTableHeader(this.columns);
                        //this.GetInvoiceStatusList();
                        this.getCreditorList();
                    });
                });
            });
        },
        methods: {
            defaultsetting() {
                this.currencycolumns = ["invoiceamount","origininvoiceamt"];
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
                    { field: 'billoneno', header: 'Bill One番号' },
                    { field: 'invoiceid', header: '請求書ID' },
                    { field: 'journalname', header: '仕訳帳' },
                    { field: 'creditorname', header: '仕入先' },
                    { field: 'invoicedate', header: '請求日' },
                    { field: 'origininvoiceamt', header: 'BillOne金額' },
                    { field: 'invoiceamount', header: '金額' },
                    { field: 'ItemCount', header: 'アイテム数' },
                    { field: 'invoicetype', header: '請求種類' }
                ],
                    this.invoicecolumnsselected = [
                    { field: 'topic', header: 'トピック' },
                    { field: 'importdate', header: '登録日付' },
                    { field: 'datatype', header: 'ステータス' },
                    { field: 'message', header: 'メッセージ' },                    
                    ];
            },
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
            creditorChange() {
                if (this.selectedcreditor == null) {
                    this.companyName = "";
                } else {
                    this.companyName = this.selectedcreditor.crdname;
                }
            },
            companyChange() {
                if (this.selectedcompany == null) {
                    this.operationcompanycode = "";
                    this.creditorlist = null;
                    this.selectedcreditor = null;
                } else {
                    this.operationcompanycode = this.selectedcompany.companycode;
                    this.getCreditorList();//仕入先リストを更新
                    CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                    this.$router.push({
                        name: 'historyinvoicelist',
                        params: { companycode: this.operationcompanycode }
                    });
                }
                this.getInvoiceListHistory();
            },           
            getInvoiceListHistory() {
                this.loading = ref(true);
                var params = {
                    'companycode': this.operationcompanycode,
                    //'billonenofrom': this.billonenofrom,
                    //'billonenoto': this.billonenoto,
                    'invoicedatefrom': CommonSetting.formatDate(this.invoiceDateFrom),
                    'invoicedateto': CommonSetting.formatDate(this.invoiceDateTo),
                    //'invoiceamountfrom': this.invoiceAmountFrom,
                    //'invoiceamountto': this.invoiceAmountTo,
                    //'creditorname': this.companyName,
                    //'registerstatus': this.searchdatastatus
                };
                //console.log(JSON.stringify(params));
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetExactPurchaseImportHistory'
                    , params).then(
                        response => (
                            this.invoicedata = JSON.parse(response.data), console.log(this.invoicedata),this.datacount = this.invoicedata.length, this.loading = ref(false)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },
            GetInvoiceStatusList() {
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceStatusList'
                    , null).then(
                        response => (
                            this.registerStatus = JSON.parse(response.data).filter(item => item.label !== "新規")
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            fncInvoiceDetail(invoiceurl) {
                window.location.href = invoiceurl;
            },

            onToggleinvoicelines(val) {//テーブルのヘッダーを表示
                this.invoicecolumnsselected = val;
            },
            
            searchInvoices() {
                this.getInvoiceListHistory();
            },
            gotoMenu() {
                this.showmenu = true;
                CommonSetting.restyleSideBar();
            },
            clearSearch() {
                this.invoiceDateFrom = null;// 日付をクリア
                this.invoiceDateTo = null;// 日付をクリア
                this.billonenofrom = null;
                this.billonenoto = null;
                this.invoiceAmountFrom = null;
                this.invoiceAmountTo = null;
                this.companyName = null;
                this.selectedcreditor = null;
            },
        }
    }
</script>
<style scoped>
</style>