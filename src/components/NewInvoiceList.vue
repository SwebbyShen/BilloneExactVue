<link rel="stylesheet" href="primevue/resources/themes/saga-blue/theme.css" />
<link rel="stylesheet" href="primevue/resources/primevue.min.css" />
<link rel="stylesheet" href="primeicons/primeicons.css" />

<template>
    <div id="invoicesearchinfo">
        <div class="d-flex justify-content-between align-items-center">
            <div class="form-group row col-md-7">
                <label for="colFormLabel" class="col-sm-3 col-form-label mt-2">
                    再表示
                </label>
                <div class="d-flex flex-row align-items-center col-md-9 mt-2">
                    <div class="d-flex flex-row col-md-3 align-items-center">
                        <Checkbox v-model="manualexclude" binary @change="searchInvoices" />&nbsp;
                        <label id="lblmanual" class="col-form-label">手動除外</label>
                    </div>
                    <div class="d-flex flex-row col-md-3 align-items-center">
                        <Checkbox v-model="manualfinish" binary @change="searchInvoices" />&nbsp;
                        <label id="lblmanual" class="col-form-label">手動完了</label>
                    </div>
                    <div class="d-flex flex-row col-md-4 align-items-center">
                        <Checkbox v-model="registeredpayable" binary @change="searchInvoices" />&nbsp;
                        <label class="col-form-label">買掛金（未検収）登録済</label>
                    </div>
                    <div class="d-flex flex-row col-md-4 align-items-center">
                        <Checkbox v-model="amountadjust" binary @change="searchInvoices" />&nbsp;
                        <label class="col-form-label">Billone金額調整（-2円～+2円）</label>
                    </div>
                    <div class="d-flex flex-row col-md-4 align-items-center">
                        <Checkbox v-model="nocreditor" binary @change="searchInvoices" />&nbsp;
                        <label class="col-form-label">除外の仕入先</label>
                    </div>
                </div>
            </div>
            <div style="text-align:right;">
                <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="height:43px;" text rounded aria-controls="overlay_menu" aria-haspopup="true" />
                <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()"><i class="pi pi-align-justify"></i>メニュー</button>
            </div>
        </div>

        <div class="form-group row mt-2" @keyup.enter="searchInvoices" v-show="showsearchbox">
            <div class="form-group row col-md-7">
                <label for="colFormLabel" class="col-sm-3 col-form-label">
                    BillOne番号
                </label>
                <div class="col-sm-4">
                    <InputNumber style="width:100%;" v-model="billonenofrom" :useGrouping="false"/>
                </div>
                <div class="col-sm-4">
                    <InputNumber style="width:100%;" v-model="billonenoto" :useGrouping="false"/>
                </div>
            </div>
            <div class="form-group row col-md-5 mt-2">
                <label for="companyname" class="col-sm-3 col-form-label">
                    仕入先
                </label>
                <div class="col-sm-7">
                    <Dropdown class="form-control" id="companyname" v-model="selectedcreditor" :options="creditorlist" placeholder="" filter optionLabel="crdname"
                              @change="creditorChange()" style="height:43px; padding:0;" showClear>
                        <template #option="slotProps">
                            <div>{{ slotProps.option.crdname }}</div>
                        </template>
                    </Dropdown>
                </div>
            </div>

            <div class="form-group row col-md-7 mt-2">
                <label for="colFormLabel" class="col-sm-3 col-form-label">
                    請求日
                </label>
                <div class="col-sm-4">
                    <Calendar v-model="invoiceDateFrom" :maxDate="invoiceDateTo" showButtonBar :dateFormat="'yy-mm-dd'" showIcon style="width: 500px; height:43px;" />
                </div>
                <div class="col-sm-4">
                    <Calendar v-model="invoiceDateTo" :minDate="invoiceDateFrom" showButtonBar :dateFormat="'yy-mm-dd'" showIcon style="width: 500px; height: 43px;" />
                </div>
            </div>

            <div v-show="isparentcompany" class="form-group row col-md-5 mt-2">
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
            <div class="form-group row col-md-7 mt-2">
                <label for="colFormLabel" class="col-sm-3 col-form-label">
                    請求合計金額
                </label>
                <div class="col-sm-4">
                    <InputNumber style="width:100%;" v-model="invoiceAmountFrom" />
                </div>
                <div class="col-sm-4">
                    <InputNumber style="width:100%;" v-model="invoiceAmountTo" />
                </div>
            </div>

            <div class="flex align-items-center form-group row col-md-7">
                <div class="col-sm-3 mt-2"></div>
                <div class="col-sm-4 mt-2" style="text-align:left;">
                    <button type="button" class="btn btn-primary" @click="searchInvoices" style="margin-right: 3px;">検索</button>
                    <button type="button" class="btn btn-warning" @click="clearSearch">クリア</button>
                </div>
            </div>
        </div>
        <TabView class="tabview-custom">
            <TabPanel>
                <template #header>
                    <button type="button" class="btn btn-outline-primary" v-on:click="showsearchbox = !showsearchbox"><font-awesome-icon :icon="['fas', 'eye']" style="padding:0" /> {{(showsearchbox ? '検索条件を非表示' : '検索条件を表示')}} </button>
                </template>
                <div class="row">
                    <DataTable :value="invoicedata" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem"
                               removableSort v-model:selection="selected_invoicelines" :metaKeySelection="false" paginator :rows="100" :rowsPerPageOptions="[5, 10, 20, 50, 100]"
                               v-model:filters="filters" filterDisplay="menu" :loading="loading" scrollable>
                        <template #header>
                            <div style="text-align:left">
                                <span>
                                    検索結果数: {{ datacount }} 件
                                </span>
                            </div>
                            <div style="text-align:left"></div>
                        </template>
                        <Column v-for="(col, index) of invoicecolumnsselected" :showFilterMenu="(col.field == 'registerstatus' ? false : (col.field == 'checkbox' ? false : true))" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="(col.field == 'registerstatus' ? false : (col.field == 'checkbox' ? false : true)) ">
                            <template #body="{ data, field}">
                                <template v-if="field === 'checkbox'">
                                    <div style="text-align:center">
                                        <!--<Checkbox v-model="data.selected" :binary="true" @change="handleRowSelectionChange(data)" />-->
                                        <Dropdown v-if="data.datatype === '手動除外'" :id="'Ddexc'+index" v-model="data.selected" placeholder="除外" :options="dataoutexc" @change="handleRowSelectionChange(data,index)" />
                                        <Dropdown v-else-if="data.datatype === '手動完了'" :id="'Ddfin'+index" v-model="data.selected" placeholder="完了" :options="dataoutfin" @change="handleRowSelectionChange(data,index)" />
                                        <Dropdown v-else :id="'Dd'+index" v-model="data.selected" placeholder="" :options="dataout" @change="handleRowSelectionChange(data,index)" />
                                    </div>
                                </template>
                                <template v-if="field === 'registerstatus'">
                                    <button type="button" class="btn btn-success btn-sm" v-if="data[field] == '新規'" v-on:click="fncInvoiceDetail(data.invoiceurl)">新規</button>
                                    <!--<button type="button" class="btn btn-primary btn-sm" v-else-if="data[field] == 'Exactへ登録済'" v-on:click="fncInvoiceDetail(data.invoiceurl)">Exactへ登録済</button>-->
                                </template>
                                <template v-else-if="field === 'creditorname'">
                                    <span style="padding-right:5px;">{{ data[field]}}</span>
                                    <Tag :style="{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}" v-if="data['invoicetype'] == 'Supply'">
                                        <font-awesome-icon :icon="['fas', 'truck-fast']" />
                                    </Tag>
                                </template>
                                <template v-else-if="field === 'invoicedate'">
                                    <span v-if="data['invcloseid'] > 0" style="color: red; font-weight: 500;">{{ data[field]}}</span>
                                    <span v-else>{{ data[field]}}</span>
                                </template>
                                <template v-else>
                                    <div>
                                        <span v-if="currencycolumns.includes(field)" style="float: right;">{{CommonSetting.formatNumber(data[field])}}</span>
                                        <span v-else style="float:left;">{{ data[field]}}</span>
                                    </div>
                                </template>
                            </template>
                            <template #filter="{ filterModel, filterCallback, field}">
                                <template v-if="field === 'registerstatus'">
                                    <Dropdown v-model="filterModel.value" @change="filterprocess(filterCallback,field)" :options="registerStatus.map(option => option.label)" placeholder="" class="p-column-filter" style="min-width: 12rem" :showClear="true"></Dropdown>
                                </template>
                                <template v-else-if="field === 'checkbox'">
                                </template>
                                <template v-else-if="field === 'datatype'">
                                    <Dropdown v-model="filterModel.value" :options="datatype" @change="filterprocess(filterCallback,field,filterModel.value)" placeholder="" class="p-column-filter">
                                    </Dropdown>
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
                        <div style="padding:10px 0 10px 0px;">{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </Sidebar>
    </div>
    <div>
        <router-view></router-view>
    </div>
    <Toast position="bottom-right" />
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
                    ItemCount: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    registerstatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    datatype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    checkbox: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    finalregisterStatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                };
            };
            initFilters();

            const errortoast = (msg) => {
                toast.add({ severity: 'error', summary: 'エラー', detail: msg, life: 3000 });//エラー発生時に、表示するToast
            };
            const infotoast = (msg) => {
                toast.add({ severity: 'info', summary: 'info', detail: msg, life: 10000 });//情報表示時に、表示するToast
            };
            const statuses = ref(['受入アイテム登録', '一時登録中']);
            const dataout = ref(['除外', '完了']);
            const dataoutexc = ref(['完了']);
            const dataoutfin = ref(['除外']);
            const datatype = ref(['未処理', '手動除外', '手動完了', '買掛金（未検収）登録済', 'Billone金額調整', '除外の仕入先']);
            const showmenu = ref(false);           
            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/wiki/spaces/ISJP/pages/819691688?parentProduct=JSM-Portal&parentProductContentContainerId=10238&initialAllowedFeatures=disable-login-flow.disable-share&locale=ja-JP#BillOne%E8%AB%8B%E6%B1%82%E6%9B%B8%E4%B8%80%E8%A6%A7', '_blank');
                document.body.click();
            };
            return {
                errortoast, filters, infotoast, statuses, showmenu, CommonSetting, dataout, datatype, dataoutexc, dataoutfin,  helpMenu
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
        props: ["invoiceid", "datastatus", "companycode", "finalnewinvoicetbl"],//URLから取得
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
                operationcompanycode: null,
                companylist: null,
                selectedcompany: null,
                manualexclude: false,//手動除外
                manualfinish: false,//手動完了
                registeredpayable: false,
                amountadjust: true,
                nocreditor: false,
                billonefinalnewinvoicetbl: null,
                currencycolumns: [],//通貨型の列名を格納
                isparentcompany: false, //親会社であるかを判断
                accesstoken: null,
                finalinvoicetable: null,
            }
        },       
        mounted() {
            this.$auth.accessToken().then((accesstoken) => {
                this.accesstoken = accesstoken;
                if (this.datastatus != undefined && this.companycode != undefined) {//Dashboardより遷移された場合
                    this.searchdatastatus = this.datastatus;
                    this.operationcompanycode = this.companycode;
                    this.showsearchbox = false;
                    this.billonefinalnewinvoicetbl = this.finalnewinvoicetbl;
                    this.defaultsetting();
                    this.GetBillOneNewInvoiceList();
                    this.setTableHeader(this.columns);
                    this.getCreditorList();
                    return;
                }
                this.invoiceDateFrom = CommonSetting.defaultStartDate();//検索条件の「From」をデフォルトとして、「本日 - 6ヶ月」でセット
                this.invoiceDateTo = CommonSetting.defaultEndDate();//検索条件の「To」をデフォルトとして、「本日 + 6ヶ月」でセット
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
                            const index = this.companylist.findIndex(c => c.companycode === this.operationcompanycode);
                            this.selectedcompany = this.companylist[index];
                            this.$router.push({
                                name: 'companyinvoicenewlist',
                                params: { companycode: this.operationcompanycode }
                            });
                        } else {
                            this.operationcompanycode = this.currentcompanycode;
                        }
                        this.defaultsetting();
                        this.GetBillOneNewInvoiceList();
                        this.setTableHeader(this.columns);
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
            filterprocess(filterCallback,field,val) {
                filterCallback();
                if (field === "datatype") {
                    if (val == "手動除外") {
                        this.manualexclude = true;
                    }
                    else if (val == "手動完了") {
                        this.manualfinish = true;
                    }
                    else if (val == "買掛金（未検収）登録済") {
                        this.registeredpayable = true;
                    }
                    else if (val == "Billone金額調整") {
                        this.amountadjust = true;
                    }
                    else if (val == "除外の仕入先") {
                        this.nocreditor = true;
                    }
                    else { }
                    this.searchInvoices();
                }
                document.body.click();
            },
            setTableHeader() {
                this.invoicecolumns = [
                    { field: 'billoneno', header: 'Bill One番号' },
                    { field: 'invoiceid', header: '請求書ID' },
                    { field: 'journalname', header: '仕訳帳' },
                    { field: 'creditorname', header: '仕入先' },
                    { field: 'invoicedate', header: '請求日' },
                    { field: 'origininvoiceamt', header: 'BillOne金額' },
                    //{ field: 'invoiceamount', header: '金額' },
                    //{ field: 'ItemCount', header: 'アイテム数' },
                    { field: 'invoicetype', header: '請求種類' },
                    { field: 'datatype', header: 'データ区分' },
                    { field: 'checkbox', header: '処理' },
                ],
                    this.invoicecolumnsselected = [
                    { field: 'billoneno', header: 'Bill One番号' },
                    { field: 'journalname', header: '仕訳帳' },
                    { field: 'creditorname', header: '仕入先' },
                    { field: 'invoicedate', header: '請求日' },
                    { field: 'origininvoiceamt', header: 'BillOne金額' },
                    //{ field: 'invoiceamount', header: '金額' },
                    //{ field: 'ItemCount', header: 'アイテム数' },
                    { field: 'datatype', header: 'データ区分' },
                    { field: 'checkbox', header: '処理' },
                    { field: 'registerstatus', header: '' },
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
                        name: 'companyinvoicenewlist',
                        params: { companycode: this.operationcompanycode }
                    });
                }
                this.GetBillOneNewInvoiceList();
            },

            handleRowSelectionChange(row,rowindex) {
                //console.log(row);
                if (!confirm("この請求書を" + row.selected + "しますか？")) {
                    row.selected = "";
                    return;
                }
                var processtype = (row.selected === "除外") ? "exclude" : "finish";
                this.SaveManualProcessInvoice(row.invoiceid, processtype);//変更後の記録を保存
                this.loading = ref(true);
                setTimeout(() => {
                    this.searchInvoices();//変更後の記録をreload
                    this.infotoast(row.creditorname + "が正常に" + row.selected + "されました。Billone番号：" + row.billoneno);
                }, 1500);
            },

            GetBillOneNewInvoiceList() {
                this.loading = ref(true);
                var params = {
                    'companycode': this.operationcompanycode,
                    'billonenofrom': this.billonenofrom,
                    'billonenoto': this.billonenoto,
                    'invoicedatefrom': CommonSetting.formatDate(this.invoiceDateFrom),
                    'invoicedateto': CommonSetting.formatDate(this.invoiceDateTo),
                    'invoiceamountfrom': this.invoiceAmountFrom,
                    'invoiceamountto': this.invoiceAmountTo,
                    'creditorname': this.companyName,
                    'registerstatus': '新規',
                    "finalnewinvoicetbl": this.billonefinalnewinvoicetbl,
                    "username": this.$auth.getCurrentUser().username,
                    "exclude": {
                        "manualexclude": this.manualexclude,
                        "manualfinish": this.manualfinish,
                        "registeredpayable": this.registeredpayable,
                        "amountadjust": this.amountadjust,
                        "nocreditor": this.nocreditor
                    }
                };
                //console.log(JSON.stringify(params));

                axios.post('https://billoneexactapi.azurewebsites.net/api/GetBillOneNewInvoiceList'
                    , params).then(
                        response => (
                            this.invoicedata = JSON.parse(response.data.displaydata),
                            //console.log(response.data.displaydata),
                            this.finalinvoicetable = response.data.finalinvoicetable,
                            this.$router.push({
                                name: 'dashboardinvoicenewlist',
                                params: {
                                    datastatus: '新規', companycode: this.operationcompanycode, finalnewinvoicetbl: this.finalinvoicetable
                                }
                            }),
                            //console.log(response.data.finalinvoicetable),
                            this.datacount = this.invoicedata.length, this.loading = ref(false)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            SaveManualProcessInvoice(invoiceid, processtype) {
                var params = {
                    'companycode': this.operationcompanycode,
                    'updateby': this.$auth.getCurrentUser().username,
                    'exludeinvoice': [{ "invoiceid": invoiceid }],
                    "processtype": processtype
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/SaveManualExculdeInvoice'
                    , params).then(console.log(invoiceid))
                    .catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            fncInvoiceDetail(invoiceurl) {
                window.location.href = invoiceurl+ "/newinvoices/" + this.finalinvoicetable;
            },

            onToggleinvoicelines(val) {//テーブルのヘッダーを表示
                this.invoicecolumnsselected = val;
            },

            searchInvoices() {
                this.GetBillOneNewInvoiceList();
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
                this.manualexclude = false;
                this.manualfinish = false;
                this.registeredpayable = false;
                this.amountadjust = true;
                this.nocreditor = false;
                this.selectedcreditor = null;
                this.searchInvoices();
            },
        }
    }
</script>
<style scoped>
</style>