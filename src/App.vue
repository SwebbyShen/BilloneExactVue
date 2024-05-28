<template>
    <div>
        <!--<router-view @move-invoicedetail="moveInvoiceDetail"></router-view>-->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    //import InvoiceList from './components/InvoiceList.vue'
    import Dashboard from './components/Dashboard.vue'
  
 export default {
        data() {
         return {
             date: new Date()
            }
        },      
        components: {
            Dashboard
        },      
        methods: {
            //moveInvoiceDetail(invoiceid) {
            //    this.$router.push({
            //        name: 'invoicedetail',
            //        params: {
            //            invoiceid: invoiceid
            //        }
            //    });
            //}
        },
        async created() {
            await this.$auth.login();           
        }
    }
</script>

<style>
    html {
        font-family: "Lato,Helvetica Neue,Arial,Helvetica,sans-serif";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: rgb(0, 0, 0);
        margin-top: 20px;
    }   
</style>
