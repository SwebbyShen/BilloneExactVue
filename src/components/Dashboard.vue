<template>
    <div class="dashboard-container">
        <div class="col-sm-12">
            <!--style="text-align:right"-->
            <div style="display: flex; align-items: center;">
                <div style="text-align:left">
                    <button type="button" class="btn btn-outline-primary" v-on:click="showsearchbox = !showsearchbox"><font-awesome-icon :icon="['fas', 'eye']" style="padding:0" /> {{(showsearchbox ? 'カレンダーを非表示' : 'カレンダーを表示')}} </button>
                    <button type="button" class="p-button p-component" @click="getDashboardBillOneNewInvoiceList(this.operationcompanycode)" style="margin-left: 2px; color: #6366F1;height: 37px"><i class="pi pi-refresh" style="color:white;">更新</i></button>
                </div>
                <div style="text-align: right; flex-grow: 1;">
                    販社名:&nbsp;
                    <Dropdown v-model="selectedcompany" :options="companylist" placeholder="全て" filter optionLabel="companyname" style="height:43px;" @change="companyChange">
                        <template #option="slotProps">
                            <div>{{ slotProps.option.companyname }}</div>
                        </template>
                    </Dropdown>
                    <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="margin-left:5px;height:43px;margin-top:-10px;" text rounded aria-haspopup="true"/>
                    <!--<Menu ref="menu" id="overlay_menu" :model="helpitems" :popup="true" />-->
                    <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()" style="margin-left:5px;height:43px;margin-top:-10px;"><i class="pi pi-align-justify"></i> メニュー</button>
                </div>
            </div>
            <div class="form-group row col-md-7 mt-2" :style="CalendarStyle" v-show="showsearchbox">
                <label class="col-sm-1 col-form-label">From</label>
                <Calendar v-model="DateFrom" :dateFormat="'yy-mm-dd'" :maxDate="DateTo" showButtonBar showIcon style="width: 250px; height:43px;" @input="handleDateChange" />
                <label class="col-sm-1 col-form-label">To</label>
                <Calendar v-model="DateTo" :dateFormat="'yy-mm-dd'" :minDate="DateFrom" showButtonBar showIcon style="width: 250px; height:43px;" @input="handleDateChange" />
            </div>
        </div>
        <!--<Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />-->

        <div class="dashboard-layout mt-2">
            <div class="flower-menu" :style="flowerMenuStyle">
                <div class="icon-card" style="position: absolute; top: 0; left: 50% " @click="moveToList('Exactへ登録済')">
                    <i class="pi pi-database text-primary"></i>
                    <span class="icon-text"> Exactへ登録済</span>
                    <div class="icon-value grey-text">件数：<span class="text-primary">{{ dataarray.exactsavedcount }}</span> 件</div>
                </div>
                <div class="icon-card" style="position: absolute; bottom: 0; left: 50% " @click="moveToList('一時登録中')">
                    <i class="pi pi-bolt text-warning"></i>
                    <span class="icon-text">一時登録</span>
                    <div class="icon-value grey-text">件数：<span class="text-warning">{{ dataarray.tempsavecount }}</span> 件</div>
                </div>
                <div class="icon-card" style="position: absolute; top: 50%; left: 0 " @click="moveToList('事前登録')">
                    <i class="pi pi-book text-info"></i>
                    <span class="icon-text">事前登録</span>
                    <div class="icon-value grey-text">件数：<span class="text-info">{{ dataarray.presavedcount }}</span> 件</div>
                </div>
                <div class="icon-card" style="position: absolute; " @click="moveToNewList('新規')">
                    <i class="pi pi-file text-danger"></i>
                    <span class="icon-text">未処理</span>
                    <div class="icon-value grey-text">件数：<span class="text-danger">{{ dataarray.newdatacount }}</span> 件</div>
                </div>
            </div>
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

        <div id="pagedisable" style="position: fixed; width: 100%; height: 100%; z-index: 1000; top: 0px; background-color: #EFEFEF; opacity: .9;" v-show="loading">
            <div style="margin: 0; position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%); font-size:20px;">
                <!--<i class="fas fa-spinner fa-spin"></i>-->
                <div class="flex-container">
                    <div><Knob v-model="value" :size="60" valueTemplate="{value}%" valueColor="MediumTurquoise" readonly /></div>
                    <div class="spacer"></div>
                    <div style="background-color:aliceblue; font-size:larger;"><span>{{ statusText }}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from '../../node_modules/axios/index';
    import { ref } from 'vue';
    import { CommonSetting } from "/service/CommonSetting.js";

    export default {
        setup() {
            const showmenu = ref(false);
            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/servicedesk/customer/portal/26/article/819691688', '_blank');
                document.body.click();
            };
            return {
                showmenu,helpMenu
            };
        },
        props: ["companycode"],//URLから取得
        data() {
            return {
                menulist: null,
                companylist: null,
                selectedcompany: null,
                DateFrom: CommonSetting.defaultStartDate(),
                DateTo: CommonSetting.defaultEndDate(),
                loading: true,
                statusText: "",
                isPageLoaded: false,
                dataarray: {
                    tempsavecount: null,
                    exactsavedcount: null,
                    presavedcount: null,
                    newdatacount: null,
                },                
                statusresult: [],
                accesstoken: null,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                value: 0,
                showsearchbox: false,
            };
        },
        watch: {
            DateFrom: 'handleDateChange', 
            DateTo: 'handleDateChange',
        },
        mounted() {
            this.$auth.accessToken().then((accesstoken) => {
                this.accesstoken = accesstoken;
                CommonSetting.checkIfParentCompany(this.$auth.getCurrentUser().username, accesstoken).then((data) => {
                    this.isparentcompany = data.IsParent;
                    this.currentcompanycode = data.CurrentCompanyCode;
                    CommonSetting.getCompanyList(this.currentcompanycode, accesstoken).then((cmplist) => {//販社リストを取得
                        this.companylist = cmplist;
                        if (this.isparentcompany) {//親会社所属のユーザーである場合
                            if (this.companycode != undefined) {//CompanyCodeがURLで指定されている場合
                                var urlselectdcompany = this.companylist.filter(obj => {
                                    return obj.companycode === this.companycode
                                });
                                //CompanyCodeがURLで指定された販社をデフォルトでセット
                                this.operationcompanycode = urlselectdcompany[0].companycode;
                                CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                                this.selectedcompany = urlselectdcompany[0];
                            } else { //CompanyCodeがURLで指定されない場合、先頭の販社をデフォルトでセット                                
                                this.operationcompanycode = localStorage.getItem('operationcompanycode');
                                if (this.operationcompanycode == undefined) { this.operationcompanycode = this.companylist[0].companycode; }
                                /*console.log(localStorage.getItem('operationcompanycode'));*/
                                 const index = this.companylist.findIndex(c => c.companycode === this.operationcompanycode);
                                this.selectedcompany = this.companylist[index];
                                if (this.operationcompanycode == null) {
                                    this.operationcompanycode = this.companylist[0].companycode;
                                    this.selectedcompany = this.companylist[0];
                                }
                                this.$router.push({
                                    name: 'companydashboard',
                                    params: { companycode: this.operationcompanycode }
                                });
                            }
                        } else {
                            this.operationcompanycode = this.currentcompanycode;
                        }
                        this.defaultsetting();
                        window.addEventListener("resize", this.handleResize);                      
                        this.getSaveDashBoardData();
                    });
                });
            });
        },

        beforeUnmount() {
            window.removeEventListener("resize", this.handleResize);
        },

        computed: {
            flowerMenuStyle() {
                if (this.windowWidth >= 1600 || this.windowHeight >= 1200) {
                    return {
                        width: '500px',
                        height: '500px',
                        transform: 'rotate(45deg)',
                        top: '-13%',
                    };
                }

                else {
                    return {
                        width: '300px',
                        height: '300px',
                        transform: 'rotate(45deg)',
                        top: '-16%',
                    };
                }
            },

            CalendarStyle() {
                if (this.windowWidth < 1200 || this.windowHeight < 900) {
                    return {
                        width: '250px',
                        height: '33px',
                    };
                }
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
            handleDateChange() {
                this.getDashboardBillOneNewInvoiceList(this.operationcompanycode);
            },

            handleResize() {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
            },
            getSaveDashBoardData() {
                var self = this;
                this.loading = true;
                this.statusText = "しばらくお待ちください。。。";
                this.value = 10;
                var params = {
                    'companycode': this.operationcompanycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo)
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetSavedDashboardData'
                    , params).then(
                        response => {
                            self.dataarray = response.data;
                            if (self.dataarray.billonefinalnewinvoicetbl == undefined) { //Dashboardのデータが事前に作成されていない場合
                                self.getDashboardBillOneNewInvoiceList(self.operationcompanycode);
                            } else {
                                self.value = 100;
                                self.loading = false;
                            }
                        } 
                        
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            //ステータスバー
            getDashboardBillOneNewInvoiceList(companycode) {
                this.loading = true;
                this.statusText = "BillOneシステムより全仕入請求書情報を取得中。。。";
                this.value = 20;
                var params = {
                    'companycode': companycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo)
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetDashboardBillOneNewInvoiceList'
                    , params).then(
                        response => (
                            this.statusresult = response.data, this.loading = false,
                            this.getDashboardExactInvoiceHistory(companycode, this.statusresult.billoneinvoicetbl)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //#2
            getDashboardExactInvoiceHistory(companycode, billoneinvoicetbl) {
                this.loading = true;
                this.statusText = "Exactシステムより履歴の仕入請求書情報を取得中。。。";
                this.value = 40;
                var params = {
                    'companycode': companycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo),
                    "billoneinvoicetbl": billoneinvoicetbl
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetDashboardExactInvoiceHistory'
                    , params).then(
                        response => (
                            this.statusresult = response.data, this.loading = false, 
                            this.getDashboardBillOneHistory(companycode, this.statusresult.billoneinvoicetbl, this.statusresult.exactinvoicehistorytbl)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //#3
            getDashboardBillOneHistory(companycode, billoneinvoicetbl, exactinvoicehistorytbl) {
                this.loading = true;
                this.statusText = "登録済の情報を確認中。。。";
                this.value = 60;
                var params = {
                    'companycode': companycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo),
                    "billoneinvoicetbl": billoneinvoicetbl,
                    "exactinvoicehistorytbl": exactinvoicehistorytbl,

                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetDashboardBillOneHistory'
                    , params).then(
                        response => (
                            this.statusresult = response.data, this.loading = false,
                            this.getDashBoardData(companycode, this.statusresult.billoneinvoicetbl, this.statusresult.exactinvoicehistorytbl, this.statusresult.billonehistorytbl)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //#4
            getDashBoardData(companycode, billoneinvoicetbl, exactinvoicehistorytbl, billonehistorytbl) {
                this.loading = true;
                this.statusText = "データ表示準備中。。。";
                this.value = 80;
                var params = {
                    'companycode': companycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo),
                    "billoneinvoicetbl": billoneinvoicetbl,
                    "exactinvoicehistorytbl": exactinvoicehistorytbl,
                    "billonehistorytbl": billonehistorytbl,
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetDashBoardData'
                    , params).then(
                        response => (
                            this.dataarray = response.data, this.loading = false, 
                            //console.log(this.dataarray),
                            this.clearDashboardTables(companycode, billoneinvoicetbl, exactinvoicehistorytbl, billonehistorytbl)
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },

            //#5
            clearDashboardTables(companycode, billoneinvoicetbl, exactinvoicehistorytbl, billonehistorytbl) {
                this.loading = true;
                this.statusText = "しばらくお待ちください。。。";
                this.value = 100;
                var params = {
                    'companycode': companycode,
                    'datefrom': CommonSetting.formatDate(this.DateFrom),
                    'dateto': CommonSetting.formatDate(this.DateTo),
                    'billoneinvoicetbl': billoneinvoicetbl,
                    'exactinvoicehistorytbl': exactinvoicehistorytbl,
                    'billonehistorytbl': billonehistorytbl,
                };
                
                axios.post('https://billoneexactapi.azurewebsites.net/api/ClearDashboardTables'
                    , params).then(
                        response => (
                            this.statusText = response.data.msg, this.loading = false
                        )
                ).catch(error => {
                    if (JSON.stringify(error).indexOf("401") >= 0) {
                        window.location.reload();
                    }
                });
            },


            moveToNewList(datastatus) {
                this.$router.push({
                    name: 'dashboardinvoicenewlist',
                    params: {
                        datastatus: datastatus, companycode: this.operationcompanycode, finalnewinvoicetbl: this.dataarray.billonefinalnewinvoicetbl
                    }
                })
            },

            moveToList(datastatus) {
                this.$router.push({
                    name: 'dashboardinvoicelist',
                    params: { datastatus: datastatus, companycode: this.operationcompanycode }
                })
            },

            gotoMenu() {
                this.showmenu = true;
                CommonSetting.restyleSideBar();
            },

            companyChange() {
                this.operationcompanycode = this.selectedcompany.companycode;   
                CommonSetting.setOperationCompanyCode(this.operationcompanycode);
                console.log(localStorage.getItem('operationcompanycode'));
                this.$router.push({
                    name: 'companydashboard',
                    params: { companycode: this.operationcompanycode }
                });
                setTimeout(function () {
                    location.reload();
                }, 100);
                
            }
        }      
    };
</script>

<style>
    .dashboard-layout {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 900px;
    }

    .flower-menu {
        position: relative;
        width: 500px;
        height: 500px;
        transform: rotate(45deg);
        top: -10%;
    }

    .icon-card {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 230px;
        height: 230px;
        background-color: #f9fafb;
        border: 1px solid rgba(34,36,38,.1);
        cursor: pointer;
        transition: transform 0.2s;
        transform: rotate(-45deg);
    }

    .icon-card i {
        font-size: 36px;
    }

    .icon-card:hover {
        transform: rotate(-45deg) scale(1.1);
        z-index: 1;
    }

    @media (max-width: 1600px) {
        .icon-card {
            width: 150px;
            height: 150px;
        }
    }

    .icon-text {
        font-size: 20px;
        font-weight: bold;
        margin-top: 5px;
    }

    .grey-text {
        color: #888;
    }
</style>

<style src="primevue/resources/primevue.min.css"></style>
<style src="primevue/resources/themes/saga-blue/theme.css"></style>
<style src="primeicons/primeicons.css"></style>