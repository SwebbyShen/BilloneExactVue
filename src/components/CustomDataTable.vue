<template>
    <DataTable :value="rowdata" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem" crollable scrollHeight="600px">
        <Column v-for="(col, index) of columns" :field="col.field" :header="col.header" :key="col.field + '_' + index" :headerStyle="headercolor">
            <template #body="{ data, field }">
                <template v-if="datecolumns.includes(field)">
                    <span>{{formatDate(data[field])}}</span>
                </template>
                <template v-else-if="currencycolumns.includes(field)">
                    <span>{{formatCurrency(data[field])}}</span>
                </template>
                <template v-else>
                    <span>{{data[field]}}</span>
                </template>
            </template>
        </Column>
    </DataTable>
</template>

<script>   
    import dayjs from 'dayjs';
    export default {
        inject: ['dialogRef'],
        setup() {
            const formatCurrency = (value) => {
                return new Intl.NumberFormat('jp-JP', { style: 'currency', currency: 'JPY' }).format(value);
            }
            const formatDate = (value) => {
                let targetdate = dayjs(value);
                return targetdate.format("YYYY-MM-DD");
            }
            return { formatCurrency, formatDate };
        },
        data() {
            return {
                columns: [],
                rowdata: [],
                headercolor: "",
                datecolumns: [],//日付型の列名を格納
                currencycolumns: [],//通貨型の列名を格納
            }
        },
        mounted() {
            const params = this.dialogRef.data;
            this.columns = params.columns;//渡された列データを取得
            this.rowdata = params.rowdata;//渡された行データを取得
            this.headercolor = params.headercolor;//渡された行データを取得
            this.datecolumns = params.datecolumns;
            this.currencycolumns = params.currencycolumns;
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>