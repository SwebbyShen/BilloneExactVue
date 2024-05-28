import dayjs from 'dayjs';
import axios from '../node_modules/axios/index';
export const CommonSetting = {
    operationcompanycode: "520",
    setOperationCompanyCode(code) {
        localStorage.setItem('operationcompanycode', code);
    },
    userflg : null,//userの管理者判定

    async getMenuList(username, accesstoken) {
        this.userflg = await this.getSystemUser(username, accesstoken);
        if (this.userflg) {
            return [
                { name: 'ダッシュボード', redirectroutename: 'dashboard' },
                { name: '仕入請求書履歴', redirectroutename: 'invoicelist' },
                { name: '新規仕入請求書一覧', redirectroutename: 'newinvoicelist' },
                { name: '仕入先一覧', redirectroutename: 'creditorlist' },
                { name: '仕入先除外設定', redirectroutename: 'creditorsettings' },
                { name: 'Exact取込履歴', redirectroutename: 'invoicelisthistory' },
                { name: 'マニュアル', redirectroutename: 'manual' },
            ];
        }
        else{
            return [
                { name: 'ダッシュボード', redirectroutename: 'dashboard' },
                { name: '仕入請求書履歴', redirectroutename: 'invoicelist' },
                { name: '新規仕入請求書一覧', redirectroutename: 'newinvoicelist' },
                { name: '仕入先一覧', redirectroutename: 'creditorlist' },
                { name: '仕入先除外設定', redirectroutename: 'creditorsettings' },
                { name: 'マニュアル', redirectroutename: 'manual' },
            ];
        }        
    },

    getAllMenu(username, accesstoken) {
        return Promise.resolve(this.getMenuList(username, accesstoken));
    },

    formatDate(value) {
        if (value == "" || value == null) return "";
        let targetdate = dayjs(value);
        return (targetdate.format("YYYY-MM-DD") == '1900-01-01' ? "" : targetdate.format("YYYY-MM-DD"));
    },

    formatDateTime(value) {
        if (value == "" || value == null) return "";
        let targetdate = dayjs(value);
        return (targetdate.format("YYYY-MM-DD") == '1900-01-01' ? "" : targetdate.format("YYYY-MM-DD hh:mm:ss"));
    },

    formatCurrency(value) {
         return new Intl.NumberFormat('jp-JP', { style: 'currency', currency: 'JPY' }).format(value);
    },
    formatNumber(value) {
        return new Intl.NumberFormat().format(value);
    },

    defaultStartDate() {
        return new Date(dayjs(new Date()).subtract(6, 'month'))
    },

    defaultEndDate() {
        return new Date(dayjs(new Date()).add(6, 'month'));
    },

    OneMonthBefore() {
        return new Date(dayjs(new Date()).subtract(1, 'month'));
    },

    Today() {
        return new Date(dayjs(new Date()));
    },

    parseHtml(html) {
        return html.replace(/{{(.+?)}}/g, (_, g) => {
            return this[g.trim()];
        });
    },

    restyleSideBar() {
        setTimeout(function () {
            document.querySelector('.p-sidebar-content').style = "padding:0px;";
            document.querySelector('.p-listbox').style = "height:93%;border:none;";
        }, 100);  
    },


    taxComputing(originalprice, taxratecode) {
        let finalprice;//税込総額
        let notaxprice = originalprice//税抜金額
        let tax;//税金
        switch (taxratecode)
        {
            case "10N"://課税仕入（10%）内税
                /*tax = originalprice / 1.1 * 0.1*/
                /*finalprice = originalprice*/
                tax = originalprice * 0.1
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "10P"://課税仕入（10%）外税
                //tax = originalprice * 0.1
                //finalprice = originalprice + tax
                tax = originalprice * 0.1
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "10U"://非適格 課税仕入（10%）内税
                //tax = originalprice / 1.1 * 0.1
                //finalprice = originalprice
                tax = originalprice * 0.1
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "10V"://非適格 課税仕入（10%）外税
                tax = originalprice * 0.1
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "J00"://非課税仕入（0%）
                tax = 0;
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "K8N"://課税仕入（軽減8%）内税
                //tax = originalprice / 1.08 * 0.08
                //finalprice = originalprice
                tax = originalprice * 0.08
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "K8P"://課税仕入（軽減8%）外税
                tax = originalprice * 0.08
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "K8U"://非適格 課税仕入（軽減8%）内税
                //tax = originalprice / 1.08 * 0.08
                //finalprice = originalprice
                tax = originalprice * 0.08
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            case "K8V"://非適格 課税仕入（軽減8%）外税
                tax = originalprice * 0.08
                finalprice = originalprice + tax
                notaxprice = finalprice - tax;
                break;
            default:
                console.log("invalid tax rate");
        }
        return { finalprice: Math.round(finalprice), notaxprice: Math.round(notaxprice),tax: Math.round(tax) }//1円未満の部分は四捨五入
    },


    async getSystemUser(username, accesstoken) {
        var self = this;
        var params = {
            "userid": username
        };
        const response = await axios.post(
            'https://billoneexactapi.azurewebsites.net/api/CheckSystemUser',
            params
        )
        return response.data.systemuser;
        
    },


    async getCurrentCompanyCode(username, accesstoken) {
        var params = {
            "username": username
        };       
        const response = await axios.post(
            'https://billoneexactapi.azurewebsites.net/api/GetLoginCompanyCode',
            params
        );
        console.log(JSON.parse(response.data));

        if (JSON.parse(response.data).length == 0) {
            //alert("所属会社が判定不可能のため、本システムのご利用はできません。");
            window.location.href = "/LoginErrorMessage";
        }
        else {
            return JSON.parse(response.data)[0].maincompanycode;
        }
        
    },

    async getCompanyList(companycode, accesstoken) { 
        var params = {
            "companycode": companycode
        };
        const response = await axios.post(
            'https://billoneexactapi.azurewebsites.net/api/GetCompanyList',
            params
        );
        return JSON.parse(response.data);        
    },

    async checkIfParentCompany(username, accesstoken) {       
        const companycode = await this.getCurrentCompanyCode(username, accesstoken);      
        var params = {
            "companycode": companycode
        };
        const response = await axios.post(
            'https://billoneexactapi.azurewebsites.net/api/IsParentCompany',
            params
        );
       
        return response.data;        
    }

};
