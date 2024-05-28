import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
/*import "primeflex/primeflex.css";*/
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import InvoiceList from './components/InvoiceList.vue'
import InvoiceListHistory from './components/InvoiceListHistory.vue'
import NewInvoiceList from './components/NewInvoiceList.vue'
import InvoiceDetail from './components/InvoiceDetail.vue'
import Dashboard from './components/Dashboard.vue'
import CreditorList from './components/CreditorList.vue';
import CreditorSettings from './components/CreditorSettings.vue';
import LoginErrorMessage from './components/LoginErrorMessage.vue';
import SessionTimeOut from './components/SessionTimeOut.vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import InlineMessage from 'primevue/inlinemessage';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import DynamicDialog from 'primevue/dynamicdialog';
import DialogService from 'primevue/dialogservice';
import ConfirmationService from 'primevue/confirmationservice';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import Skeleton from 'primevue/skeleton';
import Chip from 'primevue/chip';
import Dropdown from 'primevue/dropdown';
import Listbox from 'primevue/listbox';
import Sidebar from 'primevue/sidebar';
import Knob from 'primevue/knob';
import Tag from 'primevue/tag';
import OverlayPanel from 'primevue/overlaypanel';
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import { AuthPlugin, init } from '/service/authPlugin';
import { config } from '/service/authConfig';
import AutoComplete from 'primevue/autocomplete';
import Menu from 'primevue/menu';
import locale from 'vue3-i18n';



await init(config);


library.add(fas)
dom.watch();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Dashboard, props: true },
        { path: '/loginerrormessage', name: "loginerrormessage", component: LoginErrorMessage, props: true },
        { path: '/sessiontimeout', name: "sessiontimeout", component: SessionTimeOut, props: true }, 
        { path: '/invoicelist', name: "invoicelist", component: InvoiceList, props: true },
        { path: '/invoicelisthistory', name: "invoicelisthistory", component: InvoiceListHistory, props: true },
        { path: '/newinvoicelist', name: "newinvoicelist", component: NewInvoiceList, props: true },
        { path: '/invoicelist/datastatus/:datastatus/companycode/:companycode', name: "dashboardinvoicelist", component: InvoiceList, props: true },
        { path: '/invoicelist/companycode/:companycode', name: "companyinvoicelist", component: InvoiceList, props: true },
        //{ path: '/invoicelisthistory/datastatus/:datastatus/companycode/:companycode', name: "invoicelisthistory", component: InvoiceListHistory, props: true },
        { path: '/invoicelisthistory/companycode/:companycode', name: "historyinvoicelist", component: InvoiceListHistory, props: true },
        { path: '/newinvoicelist/datastatus/:datastatus/companycode/:companycode/newinvoices/:finalnewinvoicetbl', name: "dashboardinvoicenewlist", component: NewInvoiceList, props: true },
        { path: '/newinvoicelist/companycode/:companycode/', name: "companyinvoicenewlist", component: NewInvoiceList, props: true },
        { path: '/dashboard', name: "dashboard", component: Dashboard, props: true },
        { path: '/dashboard/companycode/:companycode', name: "companydashboard", component: Dashboard, props: true },
        { path: '/creditorlist', name: "creditorlist", component: CreditorList, props: true },
        { path: '/creditorlist/companycode/:companycode', name: "companylist", component: CreditorList, props: true }, 
        { path: '/creditorsettings', name: "creditorsettings", component: CreditorSettings, props: true },
        { path: '/creditorsettings/companycode/:companycode', name: "companysettings", component: CreditorSettings, props: true },
        { path: '/invoicedetail/invoiceid/:invoiceid/companycode/:companycode/invoiceamount/:invoiceamount/creditorcode/:creditorcode/invoiceregisterdate/:invoiceregisterdate/billoneno/:billoneno', name: "invoicedetail", component: InvoiceDetail, props: true },
        { path: '/invoicedetail/invoiceid/:invoiceid/companycode/:companycode/invoiceamount/:invoiceamount/creditorcode/:creditorcode/invoiceregisterdate/:invoiceregisterdate/billoneno/:billoneno/newinvoices/:newinvoices', name: "newinvoicedetail", component: InvoiceDetail, props: true }
    ]
});

const app = createApp(App)
app.config.productionTip = false
app.use(AuthPlugin, config);
app.use(AuthPlugin);
app.use(router);
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.use(PrimeVue, {
    locale: {        
        startsWith: '指定の値で始まる',
        endsWith: '指定の値で終わる',
        contains: '指定の値を含む',
        notContains: '指定の値を含まない',
        equals: '指定の値に等しい',
        notEquals: '指定の値に等しくない',
        noFilter: 'フィルターなし',
        matchAll: 'すべて一致',
        matchAny: '部分一致',
        clear: 'クリア',
        apply: '検索',
        addRule: 'ルール追加',
        dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
        dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
        dayNamesMin: ["日", "月", "火", "水", "木", "金", "土"],
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: '今日',
        weekHeader: 'Wk',
        firstDayOfWeek: 0,
        dateFormat: 'yy-mm-dd',
        accept: 'はい',
        reject: 'いいえ'

    }
    });
app.use(DialogService);
app.use(ConfirmationService);
app.use(AutoComplete);
app.component("DynamicDialog", DynamicDialog);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("Calendar", Calendar);
app.component("InputNumber", InputNumber);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Toast", Toast);
app.component("Button", Button);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("MultiSelect", MultiSelect)
app.component("InputSwitch", InputSwitch);
app.component("InputText", InputText);
app.component("InlineMessage", InlineMessage);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Skeleton", Skeleton);
app.component("Chip", Chip);
app.component("Dropdown", Dropdown);
app.component("Listbox", Listbox);
app.component("Sidebar", Sidebar);
app.component("Knob", Knob);
app.component("Tag", Tag);
app.component("OverlayPanel", OverlayPanel);
app.component("Checkbox", Checkbox);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Dialog", Dialog);
app.component("RadioButton", RadioButton);
app.component("AutoComplete", AutoComplete);
app.component("Menu", Menu);
app.mount('#app')
