<template>
    <form id="headerinfo" @submit="onSubmit">
        <div id="wholebody" @keydown="handleKeyDown">
            <div class="sticky" v-if="this.newinvoices != undefined">
                <div>
                    <div style="width:80px;float:left;">
                        <Button icon="pi pi-angle-double-left" severity="info" v-on:click="moveinvoice(previousinvoiceurl)" text raised rounded aria-label="次の請求書へ" v-if="previousinvoiceurl != null" />
                    </div>
                    <div style="width:80px;float:right;">
                        <Button icon="pi pi-angle-double-right" severity="info" v-on:click="moveinvoice(nextinvoiceurl)" text raised rounded aria-label="前の請求書へ" v-if="nextinvoiceurl != null" />
                    </div>
                </div>
            </div>
            <div class="">
                <div class="row" style="margin: 0; padding: 0; margin-top: -20px;">
                    <div class="col-md-10" v-on:click="fncClickOnBody" style="padding:0;">
                        <table class="table">
                            <thead :class="getTableStatusClass()">
                                <tr>
                                    <th scope="col">仕訳No.</th>
                                    <th scope="col">仕訳</th>
                                    <th scope="col">Bill One仕入請求</th>
                                    <th scope="col">Bill One番号</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><label>{{invoiceheaderinfo.glno}}</label></td>
                                    <td>
                                        <Dropdown id="selglno" v-model="selectedgl" :options="gllist" filter optionLabel="description" placeholder="該当の仕訳を選択してください。" v-on:change="changeGlNo" tabindex="1" :disabled="(invoiceheaderinfo.status == '2' ? true : false)" @keydown.enter.prevent="focusNext('txtbillonedate')">
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value">
                                                    <div>{{ slotProps.value.description }}</div>
                                                </div>
                                                <div v-else>
                                                    <div v-if="invoiceheaderinfo.glname != ''">{{ invoiceheaderinfo.glname }}</div>
                                                    <div v-else>{{ slotProps.placeholder }}</div>
                                                </div>
                                            </template>
                                            <template #option="slotProps">
                                                <div>
                                                    <div>{{ slotProps.option.description }}</div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Dropdown v-if="(invoiceheaderinfo.status == '3') ? true : false" id="selbilloneno" v-model="selectedbilloneno" :options="billonenos" filter optionLabel="billoneinfo" placeholder="該当のBill One仕入請求を選択してください。" v-on:change="changeBLOneNo" tabindex="2">
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value">
                                                    <div v-if="slotProps.value.billoneno != ''">{{ slotProps.value.billoneinfo }}&nbsp;<a style="position:relative;float:right;margin-right:10px;" href="" v-on:click="goToUrl(slotProps.value.invoiceurl)"><i class="pi pi-window-maximize"></i></a></div>
                                                    <div v-else>{{ slotProps.placeholder }}</div>
                                                </div>
                                                <div v-else>
                                                    <div v-if="invoiceheaderinfo.billoneno != ''">{{ invoiceheaderinfo.billoneinfo }}&nbsp;<a style="position:relative;float:right;margin-right:10px;" href="" v-on:click="goToUrl(invoiceheaderinfo.billoneurl)"><i class="pi pi-window-maximize"></i></a></div>
                                                    <div v-else>{{ slotProps.placeholder }}</div>
                                                </div>
                                            </template>
                                            <template #option="slotProps">
                                                <div>
                                                    <div>{{ slotProps.option.billoneinfo }} <a style="position:relative;float:right;margin-right:10px;" href="" v-on:click="goToUrl(slotProps.option.invoiceurl)"><i class="pi pi-window-maximize"></i></a></div>
                                                </div>
                                            </template>
                                        </Dropdown>

                                        <template v-else-if="invoiceheaderinfo.status == '2'">
                                            <span v-if="selectedOption.length === 1">
                                                {{ selectedOption[0].billoneinfo.split('】【').join('】 【')  }}
                                                <a style="position:relative;" href="" v-on:click="goToUrl(selectedOption[0].invoiceurl)">
                                                    <i class="pi pi-window-maximize"></i>
                                                </a>
                                            </span>
                                            <div v-else style="align-items: center;">
                                                <span>{{ selectedOption.length }} 件</span>&nbsp;
                                                <button :style="ponobtnstyle" ref="finalselectedopt" @click.prevent="handleFinalList($event)">
                                                    <font-awesome-icon :icon="['fas', 'eye']" />
                                                </button>
                                            </div>
                                        </template>
                                        <MultiSelect v-else id="multiselbilloneno" v-model="multiselectedbilloneno" :options="billonenos" filter optionLabel="billoneinfo" placeholder="該当のBill One仕入請求を選択してください。" v-on:change="changeMultiBLOneNo" tabindex="3" :maxSelectedLabels="1">
                                            <template #value="slotProps">
                                                <div>
                                                    <span v-if="slotProps.value.length === 1">
                                                        {{ slotProps.value[0].billoneinfo }}
                                                        <a style="position:relative;margin-left:10px;"
                                                           href=""
                                                           v-on:click="(event) => { event.stopPropagation(); goToUrl(slotProps.value[0].invoiceurl) }">
                                                            <i class="pi pi-window-maximize"></i>
                                                        </a>
                                                    </span>
                                                    <span v-else-if="slotProps.value.length > 1">
                                                        {{ slotProps.value.length }} items selected
                                                    </span>
                                                    <span v-else>
                                                        {{ slotProps.placeholder }}
                                                    </span>
                                                </div>
                                            </template>
                                            <template #option="slotProps">
                                                <div>
                                                    <span>{{ slotProps.option.billoneinfo }}</span>
                                                    <a style="position:relative; margin-left: 10px;" href="" v-on:click="(event) => { event.stopPropagation(); goToUrl(slotProps.option.invoiceurl) }">
                                                        <i class="pi pi-window-maximize"></i>
                                                    </a>
                                                </div>
                                            </template>
                                        </MultiSelect>                                        
                                    </td>
                                    <td>
                                        {{invoiceheaderinfo.billoneno}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-2" style="padding:0;">
                        <div class="container-fluid" style="display: flex; flex-direction: column; align-items: flex-end;">
                            <div style="display: flex; align-items: center; justify-content: flex-end; width: 100%;">
                                <Button icon="pi pi-question-circle" severity="secondary" @click="helpMenu" style="height:43px;" text rounded aria-controls="overlay_menu" aria-haspopup="true" />
                                <button id="btnback" type="button" class="btn btn-light" @click="gotoMenu()" style="width: 95px; "><i class="pi pi-align-justify"></i> メニュー</button>
                            </div>
                            <button id="btnPrevious" type="button" class="btn btn-light" @click="gotoPrevious()" style="width: 95px; margin-top: 5px;"><i class="pi pi-arrow-left"></i> 戻る</button>
                        </div>
                    </div>
                </div>
                <div class="row" v-on:click="fncClickOnBody" style="margin: 0; padding: 0;">
                    <div class="row col-md-12" style="padding:0;">
                        <table class="table">
                            <thead :class="getTableStatusClass()">
                                <tr>
                                    <th scope="col">日付</th>
                                    <th scope="col">レポート日付</th>
                                    <th scope="col">仕入先</th>
                                    <th scope="col">請求書金額</th>
                                    <th scope="col">外部参照情報</th>
                                    <th scope="col">金額</th>
                                    <th scope="col">{{(invoiceheaderinfo.status == '2' ? '調整金額' : '差額')}}</th>
                                    <th scope="col">説明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Calendar id="txtbillonedate" v-model="invoiceheaderinfo.billoneinvdate" showIcon dateFormat="yy-mm-dd" style="margin-top:0px; width:160px; height:35px;" tabindex="3"
                                                  :disabled="(invoiceheaderinfo.status == '2' ? true : false)" @date-select="checkValidInvoiceDate('txtinvdate')" :class="getInvoiceDateClass()" />
                                    </td>
                                    <td>
                                        <Calendar id="txtreportdate" v-model="invoiceheaderinfo.reportdate" showIcon dateFormat="yy-mm-dd" style="margin-top:0px; width:160px; height:35px;" tabindex="4"
                                                  :disabled="(invoiceheaderinfo.status == '2' ? true : false)" @date-select="focusNext('txtyourref')" />
                                    </td>
                                    <td>{{invoiceheaderinfo.vendorname}}</td>
                                    <td>{{CommonSetting.formatCurrency(invoiceheaderinfo.billoneinvamt)}}</td>
                                    <td>
                                        <input id="txtyourref" type="text" :class="inputClasses" @input="handleMust" placeholder="" aria-label="" aria-describedby="basic-addon1" v-model="invoiceheaderinfo.yourref" tabindex="5"
                                               :disabled="(invoiceheaderinfo.status == '2' ? true : false)" @keydown.enter.prevent="focusNext">
                                    </td>
                                    <td>
                                        <div class="input-group mb-3">
                                            <InputNumber id="txtinvamt" v-model="invoiceheaderinfo.entryinvamt" tabindex="6" style="height: 37.5px;"
                                                         :disabled="(invoiceheaderinfo.status == '2' ? true : false)" @keydown.enter.prevent="focusNext" readonly />
                                        </div>
                                    </td>
                                    <td>
                                        <span v-if="invoiceheaderinfo.status == '2' && correctionamt > 0" style="color:blue;font-weight:500;text-decoration:underline;cursor:pointer;" @click="showCorrectionLineInfo">{{CommonSetting.formatCurrency(correctionamt)}}</span>
                                        <span v-else-if="invoiceheaderinfo.status == '2' && correctionamt == 0">{{CommonSetting.formatCurrency(correctionamt)}}</span>
                                        <span v-else :class="getAmountDiffClass()">{{CommonSetting.formatCurrency(invoiceheaderinfo.billoneinvamt - invoiceheaderinfo.entryinvamt)}}</span>
                                    </td>
                                    <td> <textarea id="txtremark" class="form-control" rows="1" v-model="invoiceheaderinfo.remark" tabindex="7" :disabled="(invoiceheaderinfo.status == '2' ? true : false)"></textarea></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row" v-on:click="fncClickOnBody" style="margin: 0; padding: 0;">
                    <div class="row col-md-4">
                        <div class="row col-md-8">
                            <div class="container-fluid" style="text-align:left;">
                                <button id="btnsave" type="button" class="btn btn-primary" v-on:click="saveToExact()" v-show="(invoiceheaderinfo.status == '2' ? false : true)" :style="exactbuttonstyle"><i class="pi pi-database"></i>{{exactsave}}<span :style="{ color: 'red' }">{{btnalert}} </span></button>
                                <!--Exactへ登録-->
                                <button id="btntempsave" type="button" class="btn btn-warning" v-on:click="saveAsTemp()" v-show="(invoiceheaderinfo.status == '0' || invoiceheaderinfo.status == '1' ? true : false)" style=" margin-left: 3px; margin-right: 3px; "> <i class="pi pi-bolt"></i> 一時登録</button>
                                <button id="btntempsave" type="button" class="btn btn-info" v-on:click="saveAsPrior()" v-show="(invoiceheaderinfo.status == '3' ? true : false)" :style="prebuttonstyle"> <i class="pi pi-book"></i> {{presave}}<span :style="{ color: 'red' }">{{btnalert}}</span></button>
                                <!--事前登録-->
                            </div>
                        </div>
                        <div class="row col-md-4">
                            <button v-if="!itemsearchbox" type="button" class="btn btn-outline-primary" v-on:click="itemsearchbox = !itemsearchbox" v-show="(invoiceheaderinfo.status == '2' ? false : true)"><font-awesome-icon :icon="['fas', 'eye']" /> 検索条件表示</button>
                        </div>
                    </div>

                    <div class="row col-md-4">
                        <div class="container-fluid d-flex">
                            <div class="row col-md-4" style="margin-right:1px;padding-right:15px;">
                                <Chip v-if="!productsearchboxloading && productsearchresult != ''" :label="productsearchresult" icon="pi pi-search" removable />
                            </div>
                            <div class="row col-md-4" style="margin-right:1px;padding-right:15px;">
                                <Chip v-if="!supplysearchboxloading && supplysearchresult!= ''" :label="supplysearchresult" icon="pi pi-search" removable />
                            </div>
                            <div class="row col-md-4" style="margin-right:1px;padding-right:15px;">
                                <Chip v-if="!historysearchboxloading && historysearchresult!= ''" :label="historysearchresult" icon="pi pi-search" removable />
                            </div>
                        </div>
                    </div>

                    <div class="row col-md-4" style="padding:0">
                        <div class="container-fluid d-flex" style="padding:0" v-show="(invoiceheaderinfo.status == '2' ? false : true)">
                            <button type="button" class="btn btn-primary" @click="showSelectedProducts(selected_finalproductlines,finalproductlineselected)" style="width: 250px; margin-left: 2px;">
                                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" /> 選択中の製品数 : <span class="badge bg-secondary">{{selected_finalproductlines.length}}</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="showSelectedProducts(selected_supplylines,supplylineselected)" style="width: 300px; margin-left: 2px;">
                                <font-awesome-icon :icon="['fas', 'truck-fast']" /> 選択中のサプライ品数 : <span class="badge bg-secondary">{{selected_supplylines.length}}</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="showSelectedProducts(selected_historylines,historylineselected)" style="width: 300px; margin-left: 2px;">
                                <i class="pi pi-history" v-if="!historysearchboxloading"></i> 選択中の登録済請求書数 : <span class="badge bg-secondary">{{selected_historylines.length}}</span>
                            </button>
                        </div>
                        <DynamicDialog />
                    </div>
                </div>
                <TabView class="tabview-custom" v-on:click="fncClickOnBody" v-model:activeIndex="activetab" @tab-change="setSelectedTab">
                    <TabPanel>
                        <template #header>
                            <div>
                                <ProgressSpinner v-if="productsearchboxloading" style="width: 15px; height: 15px;" strokeWidth="8" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" v-if="!productsearchboxloading" />
                                <span>　製品</span>
                            </div>
                        </template>
                        <div id="itemsearchbox" v-if="itemsearchbox" class="form-group row mt-2">
                            <div class="form-group row col-md-10">
                                <label for="colFormLabel" class="col-sm-2 col-form-label">
                                    一覧の表示
                                </label>
                                <div class="col-sm-6" style="text-align:left;">
                                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                        <input type="radio" class="btn-check" name="btngroup" id="radnogroup" autocomplete="off" tabindex="5" value="radnogroup" :checked="searchcontrol.searchgroupby == 'radnogroup'" v-on:change="changeSearchGroup($event)">
                                        <label class="btn btn-outline-primary" for="radnogroup">シリアル別</label>
                                        <input type="radio" class="btn-check" name="btngroup" id="radpogroup" autocomplete="off" tabindex="5" value="radpogroup" :checked="searchcontrol.searchgroupby == 'radpogroup'" v-on:change="changeSearchGroup($event)">
                                        <label class="btn btn-outline-primary" for="radpogroup">アイテム別</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row col-md-10 mt-1">
                                <label for="colFormLabel" class="col-sm-2 col-form-label">
                                    受入日
                                </label>
                                <div class="form-group row col-sm-6">
                                    <div class="col-sm-4">
                                        <Calendar id="txtinvoicedatefrom" v-model="searchcontrol.txtinvoicedatefrom" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="7" />
                                    </div>
                                    <div class="col-sm-1" style="text-align:center;">
                                        <span>～</span>
                                    </div>
                                    <div class="col-sm-4">
                                        <Calendar id="txtinvoicedateto" :minDate="searchcontrol.txtinvoicedatefrom" v-model="searchcontrol.txtinvoicedateto" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="8" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row col-md-10">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-4">
                                    <button type="button" class="btn btn-primary" style="float:left;margin-top:10px; margin-right:5px;" v-on:click="searchItem">検索</button>&nbsp;
                                    <button type="button" class="btn btn-warning" style="float:left;margin-top:10px;" v-on:click="cancelSearch">キャンセル</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="!itemsearchbox" class="row" style="padding:0;">
                            <DataTable :value="finalproductinfo" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem; max-height:450px;" editMode="cell" tableClass="editable-cells-table"
                                       paginator :rows="50" :rowsPerPageOptions="[50,100, 150, 200, 250]" scrollable scrollHeight="410px"
                                       :selectionMode="(invoiceheaderinfo.status == '2' ? 'none' : 'multiple')" removableSort v-model:selection="selected_finalproductlines" :metaKeySelection="false"
                                       v-model:filters="filters" filterDisplay="menu" :loading="productsearchboxloading" @rowSelect="onFinalProductLineSelect" @rowUnselect="onFinalProductLineRemove">
                                <template #loading>
                                    <div class="card">
                                        <div class="border-round border-1 surface-border p-4 surface-card">
                                            <div class="flex mb-3">
                                                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template #header>
                                    <div style="text-align:left">
                                        <MultiSelect :modelValue="finalproductlineselected" :options="finalproductlinecolumns" optionLabel="header" @update:modelValue="onToggleFinalproductlines"
                                                     display="chip" placeholder="Select Columns" style="width:85%" />
                                        <button type="button" class="p-button p-component" @click="getReceiptItemInfo()" style="margin-left: 2px; color: #6366F1;height: 50px"><i class="pi pi-refresh" style="color:white;">更新</i></button>
                                    </div>
                                </template>
                                <Column v-for="(col, index) of finalproductlineselected" :field="col.field" :header="col.header" :key="col.field + '_' + index" showFilterMenu sortable :headerStyle="getProductHeaderStyle()">
                                    <template #body="{ data, field }" #editor="{ data, field }">
                                        <template v-if="datecolumns.includes(field)">
                                            <span>{{CommonSetting.formatDate(data[field])}}</span>
                                        </template>
                                        <template v-else-if="currencycolumns.includes(field)">
                                            <InputNumber v-if="field == 'outstanding' && invoiceheaderinfo.status != '2'" style="text-align: right;" :id="'inputText_' + index" v-model="data[field]" @blur="changeItemAmount($event,data,field,'未決済金額を入力してください。')" @click="RemoveItem('製品',data)" />
                                            <span v-else style="float: right;">{{CommonSetting.formatNumber(data[field])}}</span>
                                        </template>
                                        <template v-else>
                                            <AutoComplete v-if="field == 'vatcode' && invoiceheaderinfo.status != '2'" @change="handleInput($event,index)" :id="'inputText_' + index" style="width:120px;" v-model="data[field]" dropdown :suggestions="filteredtaxlist" optionLabel="btwtrans" @complete="searchTaxList($event,data,field)" v-on:keyup.f2="showTaxList($event,data,field,'税コードを入力してください。')" @blur="changeTaxCode($event,data,'F2キーを押下して税コードを入力してください。')" @click="RemoveItem('製品',data)" />
                                            <AutoComplete v-else-if="field == 'costcenter' && invoiceheaderinfo.status != '2'" @change="handleInput($event,index)" :id="'inputText_' + index" style="width:170px;" v-model="data[field]" dropdown :suggestions="filteredcostcenterlist" optionLabel="kstplcode" @complete="searchCostCenterList($event,data[field])" v-on:keyup.f2="showCostCenterList($event,data,field)" @blur="changeCostCenter($event,data,'F2キーを押下してコストセンターを入力してください。')" @click="RemoveItem('製品',data)" />
                                            <InputText v-else-if="field == 'description'  && invoiceheaderinfo.status != '2'" @input="handleInput($event,index)" :id="'inputText_' + index" type="text" v-model="data[field]" @blur="blurRowSelect(data,'製品')" @click="RemoveItem('製品',data)" />
                                            <span v-else>{{data[field]}}</span>
                                        </template>
                                    </template>
                                    <template #filter="{ filterModel, filterCallback,field}">
                                        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @keydown.enter="filterCallback()" placeholder="" />
                                    </template>
                                </Column>
                                <template #empty v-if="!itemsearchbox">
                                    <div v-html="CommonSetting.parseHtml(nodatamessage)" />
                                </template>
                            </DataTable>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <template #header>
                            <div>
                                <ProgressSpinner v-if="supplysearchboxloading" style="width: 15px; height: 15px;" strokeWidth="8" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                <font-awesome-icon :icon="['fas', 'truck-fast']" v-if="!supplysearchboxloading" />
                                <span>　サプライ品</span>
                            </div>
                        </template>

                        <div v-if="itemsearchbox" class="form-group row mt-2">
                            <div class="form-group row col-md-10 mt-1">
                                <label for="colFormLabel" class="col-sm-2 col-form-label">
                                    出荷日
                                </label>
                                <div class="form-group row col-sm-6">
                                    <div class="col-sm-4">
                                        <Calendar id="txtiosdatefrom" v-model="searchcontrol.txtiosdatefrom" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="7" />
                                    </div>
                                    <div class="col-sm-1" style="text-align:center;">
                                        <span>～</span>
                                    </div>
                                    <div class="col-sm-4">
                                        <Calendar id="txtiosdateto" :minDate="searchcontrol.txtiosdatefrom" v-model="searchcontrol.txtiosdateto" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="8" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row col-md-10">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-4">
                                    <button type="button" class="btn btn-primary" style="float:left;margin-top:10px; margin-right:5px;" v-on:click="searchSupply">検索</button>&nbsp;
                                    <button type="button" class="btn btn-warning" style="float:left;margin-top:10px;" v-on:click="cancelSearch">キャンセル</button>
                                </div>
                            </div>
                        </div>

                        <div v-if="!itemsearchbox" class="row" style="padding:0;">
                            <DataTable :value="supplyinfo" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem" paginator :rows="50"
                                       scrollable scrollHeight="410px" :rowsPerPageOptions="[50, 100, 150, 200, 250]"
                                       :selectionMode="(invoiceheaderinfo.status == '2' ? 'none' : 'multiple')" removableSort v-model:selection="selected_supplylines" :metaKeySelection="false"
                                       v-model:filters="supplyfilters" filterDisplay="menu" :loading="supplysearchboxloading" @rowSelect="onSupplyLineSelect" @rowUnselect="onSupplyLineRemove">
                                <template #loading>
                                    <div class="card">
                                        <div class="border-round border-1 surface-border p-4 surface-card">
                                            <div class="flex mb-3">
                                                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template #header>
                                    <div style="text-align:left">
                                        <MultiSelect :modelValue="supplylineselected" :options="supplylinecolumns" optionLabel="header" @update:modelValue="onToggleSupplyLines"
                                                     display="chip" placeholder="Select Columns" style="width:85%" />
                                        <button type="button" class="p-button p-component" @click="getSupplyItemInfo()" style="margin-left: 2px; color: #6366F1;height: 50px"><i class="pi pi-refresh" style="color:white;">更新</i></button>
                                    </div>
                                </template>
                                <Column v-for="(col, index) of supplylineselected" :field="col.field" :header="col.header" :key="col.field + '_' + index" sortable showFilterMenu :headerStyle="getProductHeaderStyle()">
                                    <template #body="{ data, field }">
                                        <div v-on:click.right="showSupplyItemDetail($event,supplyinfo,data['inqno'])">
                                            <template v-if="datecolumns.includes(field)">
                                                <span>{{CommonSetting.formatDate(data[field])}}</span>
                                            </template>
                                            <template v-else-if="currencycolumns.includes(field)">
                                                <InputNumber v-if="field == 'sk2' && invoiceheaderinfo.status != '2'" style="text-align: right;" @input="handleInput($event,index)" :id="'inputText_' + index" v-model="data[field]" @blur="changeItemAmountSupply($event,data,field,'金額（税抜）を入力してください。')" @click="RemoveItem('サプライ',data)" />
                                                <span v-else style="float:right;">{{CommonSetting.formatNumber(data[field])}}</span>
                                            </template>
                                            <template v-else-if="field === 'itemname'">
                                                <span style="margin-right:10px;">{{data[field]}}</span>
                                            </template>
                                            <template v-else-if="field === 'exactstatus'">
                                                <i v-if="data[field] == '受入済'" class="pi pi-check" style="color: green; font-size:larger;"></i>
                                                <i v-else class="pi pi-times" style="color: red; font-size: larger; "></i>
                                            </template>
                                            <template v-else>
                                                <AutoComplete v-if="field == 'exvat' && invoiceheaderinfo.status != '2'" style="width:120px;" @change="handleInput($event,index)" :id="'inputText_' + index" v-model="data[field]" dropdown :suggestions="filteredtaxlist" optionLabel="btwtrans" @complete="searchTaxList($event,data,field)" v-on:keyup.f2="showSupplyTaxList($event,data,field,'税コードを入力してください。')" @blur="changeSupplyTaxCode($event,data,'F2キーを押下して税コードを入力してください。')" @click="RemoveItem('サプライ',data)" />
                                                <span v-else>{{data[field]}}</span>
                                            </template>
                                        </div>
                                    </template>
                                    <template #filter="{ filterModel,filterCallback, field}">
                                        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @keydown.enter="filterCallback()" placeholder="" />
                                    </template>
                                </Column>
                                <template #empty v-if="!itemsearchbox">
                                    <div v-html="CommonSetting.parseHtml(supplynodatamessage)" />
                                </template>
                            </DataTable>
                        </div>
                    </TabPanel>
                    <!--登録済請求書タブ-->
                    <TabPanel>
                        <template #header>
                            <div>
                                <ProgressSpinner v-if="historysearchboxloading" style="width: 15px; height: 15px;" strokeWidth="8" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                <i class="pi pi-history" v-if="!historysearchboxloading"></i>
                                <span>　登録済請求書</span>
                            </div>
                        </template>

                        <div id="itemsearchbox" v-if="itemsearchbox" class="form-group row mt-2">
                            <div class="form-group row col-md-10 mt-1">
                                <label for="colFormLabel" class="col-sm-2 col-form-label">
                                    レポート日付
                                </label>
                                <div class="form-group row col-sm-6">
                                    <div class="col-sm-4">
                                        <Calendar id="txthistorydatefrom" v-model="searchcontrol.txthistorydatefrom" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="7" />
                                    </div>
                                    <div class="col-sm-1" style="text-align:center;">
                                        <span>～</span>
                                    </div>
                                    <div class="col-sm-4">
                                        <Calendar id="txthistorydateto" v-model="searchcontrol.txthistorydateto" showIcon dateFormat="yy-mm-dd" style="height:40px;" tabindex="8" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row col-md-10">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-4">
                                    <button type="button" class="btn btn-primary" style="float:left;margin-top:10px; margin-right:5px;" v-on:click="searchHistory">検索</button>&nbsp;
                                    <button type="button" class="btn btn-warning" style="float:left;margin-top:10px;" v-on:click="cancelSearch">キャンセル</button>
                                </div>
                            </div>
                        </div>

                        <div v-if="!itemsearchbox" class="row" style="padding:0;">
                            <DataTable :value="historyinfo" resizableColumns columnResizeMode="fit" showGridlines tableStyle="min-width: 50rem" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                                       :selectionMode="(invoiceheaderinfo.status == '2' ? 'none' : 'multiple')" removableSort v-model:selection="selected_historylines" :metaKeySelection="false"
                                       v-model:filters="historyfilters" filterDisplay="menu" :loading="historysearchboxloading" scrollable scrollHeight="430px" @rowSelect="onHistoryLineSelect" @rowUnselect="onHistoryLineRemove">
                                <template #loading>
                                    <div class="card">
                                        <div class="border-round border-1 surface-border p-4 surface-card">
                                            <div class="flex mb-3">
                                                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template #header>
                                    <div style="text-align:left">
                                        <MultiSelect :modelValue="historylineselected" :options="historylinecolumns" optionLabel="header" @update:modelValue="onToggleHistoryLines" display="chip" placeholder="Select Columns" style="width:85%" />
                                    </div>
                                </template>
                                <Column v-for="(col, index) of historylineselected" :field="col.field" :header="col.header" :key="col.field + '_' + index" sortable showFilterMenu :headerStyle="getProductHeaderStyle()">
                                    <template #body="{ data, field }">
                                        <div>
                                            <template v-if="datecolumns.includes(field)">
                                                <span>{{CommonSetting.formatDate(data[field])}}</span>
                                            </template>
                                            <template v-else-if="currencycolumns.includes(field)">
                                                <span style="float: right;">{{CommonSetting.formatNumber(data[field])}}</span>
                                            </template>
                                            <template v-else-if="field === 'itemname'">
                                                <span style="margin-right:10px;">{{data[field]}}</span>
                                            </template>
                                            <template v-else-if="field === 'exactstatus'">
                                                <i v-if="data[field] == '受入済'" class="pi pi-check" style="color: green; font-size:larger;"></i>
                                                <i v-else class="pi pi-times" style="color: red; font-size: larger; "></i>
                                            </template>
                                            <template v-else-if="field === 'pono'">
                                                <span>{{data[field]}}</span>&nbsp;
                                                <!--v-tooltip.top="{ value: 'Pono表示'}"-->
                                                <button v-if="data[field]" :style="ponobtnstyle" @click.prevent="handlePonoList($event, data.bkstnr)">
                                                    <font-awesome-icon :icon="['fas', 'eye']" />
                                                </button>
                                            </template>
                                            <template v-else>
                                                <span>{{data[field]}}</span>
                                            </template>
                                        </div>
                                    </template>
                                    <template #filter="{ filterModel,filterCallback,field}">
                                        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @keydown.enter="filterCallback()" placeholder="" />
                                    </template>
                                </Column>
                                <template #empty v-if="!itemsearchbox">
                                    <div v-html="CommonSetting.parseHtml(historynodatamessage)" />
                                </template>
                            </DataTable>
                        </div>
                    </TabPanel>
                </TabView>
                <div>
                    <router-view></router-view>
                </div>
                <Toast position="bottom-right" />
                <ConfirmDialog group="positionDialog"></ConfirmDialog>
                <ConfirmDialog></ConfirmDialog>
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="showmenu" style="padding:0;" position="right">
                        <h2>メニュー</h2>
                        <Listbox :options="menulist" optionLabel="name" class="w-full md:w-14rem">
                            <template #option="slotProps">
                                <!--<div class="flex align-items-center" @click="$router.push({ name: slotProps.option.redirectroutename })">-->
                                <div class="flex align-items-center" @click="menuChange(slotProps.option.redirectroutename)">
                                    <div style="padding:10px 0 10px 0px;">{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Listbox>
                    </Sidebar>
                </div>
                <div id="pagedisable" style="position: fixed; width: 100%; height: 100%; z-index: 1000; top: 0px; background-color: #EFEFEF; opacity: .5;" v-show="false">
                </div>
                <OverlayPanel ref="opsupplyitem">
                    <div class="form-group row" style="max-width:1300px; text-align: left; max-height: 400px; overflow-y: scroll; outline: 5px solid #00A1E0; background: #00A1E0; padding-left:30px;">
                        <div class="form-group row col-md-6">
                            <span class="col-sm-5 col-form-label lightblueback">
                                問合せ番号
                            </span>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.inqno}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                伝票番号
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.slip}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                IOS顧客
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.customer}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact顧客
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.excustomer}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                IOS納品先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.delivery}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact納品先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exdelivery}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                IOS請求先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.receiver}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact請求先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exreceiver}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                IOS担当者
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.hrperson}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact担当者
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exhrperson}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                IOS営業所
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.officeperson}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exactコストセンター
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.excostcenter}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                出荷担当
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.deliverperson}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact部門
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exdepartment}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                発注先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.orderperson}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact仕入先
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exsupplier}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                直行区分
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.class2}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact消費税
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exvat}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                発注日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.orddate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                受注日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.orddate2)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                納品希望日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDate(showsupply.hopedate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                納品日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDate(showsupply.addupdate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                出荷日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDate(showsupply.shipdate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                出荷処理日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.shipsdate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                納品処理日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.addupsdate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                データ送信日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.baandate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                メーカー送信（日）
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.makerdelivery)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                メーカー受信（日）
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.makerdelivery}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                オーダー確認日
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{CommonSetting.formatDateTime(showsupply.confdate)}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                連絡
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.msg}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                商品分類
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.itemtype}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact品目区分
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exitemtype}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                売上分類
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.saletype}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                品目区分（ローカル）
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exitemtypelocal}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                ePlace商品コード
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.ep_cd}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label pinkback">
                                Exact商品
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.exite}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                発注先商品コード
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.basicsup_cd}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                出荷担当納品先コード
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.nou_cd}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                1巻当り枚数
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.mai}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="companyname" class="col-sm-5 col-form-label lightblueback">
                                入数
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.iri}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-form-label lightblueback">
                                備考欄
                            </label>
                        </div>
                        <div class="form-group row col-md-6">
                            <div class="col-form-label whiteback">
                                <span>{{showsupply.text}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-form-label lightblueback">
                                通信欄
                            </label>
                        </div>
                        <div class="form-group row col-md-6">
                            <div class="col-form-label whiteback">
                                <span>{{showsupply.text2}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-form-label lightblueback">
                                出荷メッセージ
                            </label>
                        </div>
                        <div class="form-group row col-md-6">
                            <div class="col-form-label whiteback">
                                <span>{{showsupply.text3}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                顧客指定番号
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.customerdesiredno}}</span>
                            </div>
                        </div>
                        <div class="form-group row col-md-6">
                            <label for="colFormLabel" class="col-sm-5 col-form-label lightblueback">
                                対象伝票番号
                            </label>
                            <div class="col-sm-7 col-form-label whiteback">
                                <span>{{showsupply.targetslip}}</span>
                            </div>
                        </div>
                    </div>
                </OverlayPanel>
                <OverlayPanel ref="optaxdisplay">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>コード</th>
                                <th>説明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tax in taxlist" style="cursor:pointer;" v-on:click="selectTax(tax)">
                                <td>{{tax.btwtrans }}</td>
                                <td>{{tax.oms30}}</td>
                            </tr>
                        </tbody>
                    </table>
                </OverlayPanel>
                <OverlayPanel ref="splytaxdisplay">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>コード</th>
                                <th>説明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tax in taxlist" style="cursor:pointer;" v-on:click="selectSupplyTax(tax)">
                                <td>{{tax.btwtrans }}</td>
                                <td>{{tax.oms30}}</td>
                            </tr>
                        </tbody>
                    </table>
                </OverlayPanel>
                <OverlayPanel ref="opcostcenterdisplay">
                    <div style="max-height:400px; overflow-y:scroll;">
                        <span class="p-input-icon-right" style="position: sticky;top: 0;background-color:white; z-index:100;">
                            <i class="pi pi-spin pi-spinner" v-show="loadkeywordcostcenter" />
                            <InputText v-model="value2" placeholder="Search" v-on:keyup="costcentkeywordsearch($event)" />
                        </span>
                        <table class="table table-bordered table-hover">
                            <thead style="position: sticky;top: 50px">
                                <tr>
                                    <th>コード</th>
                                    <th>説明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ccl in filteredcostcenterlist" style="cursor:pointer;" v-on:click="selectCostCenter(ccl)">
                                    <td>{{ccl.kstplcode }}</td>
                                    <td>{{ccl.oms25}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </OverlayPanel>
                <OverlayPanel ref="opcorline">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>勘定科目名</th>
                                <th>金額</th>
                                <th>備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="acc in correctionlines">
                                <td>{{acc.account }}</td>
                                <td>{{CommonSetting.formatCurrency(acc.amount)}}</td>
                                <td>{{acc.remark}}</td>
                            </tr>
                        </tbody>
                    </table>
                </OverlayPanel>
                <OverlayPanel ref="oppono">
                    <div style="max-width:300px; text-align: left; max-height: 400px;">
                        <h3 style="font-size: 18px; font-weight: bold; ">発注番号:</h3>
                        <span v-html="tooltipContent"></span>
                    </div>
                </OverlayPanel>
                <OverlayPanel ref="finalselectedopt">
                    <div style="max-width:1000px; text-align: left;">
                        <ul>
                            <li v-for="(value, index) in selectedOption" :key="index">
                                {{ value.billoneinfo }}
                                <a style="position:relative;float:right;margin-right:10px;" href="" v-on:click="goToUrl(value.invoiceurl)"><i class="pi pi-window-maximize"></i></a>
                            </li>
                        </ul>
                    </div>
                </OverlayPanel>
                <Dialog v-model:visible="amountdiff" modal header="BillOneの「請求書金額」と選択したアイテムの合計「金額」が一致しません！" :style="{ width: '80vw' }">
                    <div style="text-align:left;">
                        <p>
                            ヘッダー合計と明細金額を一致させる必要があります。<br />
                            請求書金額： {{CommonSetting.formatCurrency(invoiceheaderinfo.billoneinvamt)}}<br />
                            選択： {{CommonSetting.formatCurrency(invoiceheaderinfo.entryinvamt)}}<br />
                            差額： <span :class="getAmountDiffClass()">{{CommonSetting.formatCurrency(invoiceheaderinfo.billoneinvamt - invoiceheaderinfo.entryinvamt)}}</span>
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <p style="display: flex; align-items: center;">
                                <RadioButton v-model="amountrepairtype" inputId="repair2" name="repair" value="2" checked />
                                <label for="repair2" class="ml-2">　差額を相殺</label>&nbsp;&nbsp;
                                <MultiSelect filter v-model="selectedaccountlist" :options="accountlist" optionLabel="account" placeholder="アカウントを選択してください" class="w-full md:w-10rem" :maxSelectedLabels="0" />
                            </p>
                        </div>
                        <div>
                            <table class="table table-bordered" style="width:100%;">
                                <thead>
                                    <tr>
                                        <th style="width:10%;">コード</th>
                                        <th style="width:25%;">勘定科目名</th>
                                        <th style="width:15%;">金額</th>
                                        <th style="width:30%;">備考</th>
                                        <th style="width:10%;">社員</th>
                                        <th style="width:10%;">コストセンター</th>
                                        <th style="width:10%;">削除</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(account,index) in selectedaccountlist">
                                        <td style="width:10%;">{{account.reknr}}</td>
                                        <td style="width:25%;">{{account.oms25_0}}</td>
                                        <td style="width:15%;">
                                            <!--mode="currency" currency="JPY" locale="jp-JP"-->
                                            <InputNumber v-model="account.amount" style="width:100%;" @change="HalfChange($event,account)" @input="repairAmountChange($event,account)" showButtons />
                                        </td>
                                        <td style="width:30%;">
                                            <InputText type="text" :class="remarkClasses(account.remark)" @input="handleRemark(account.remark,index)" v-model="account.remark" style="width:100%;" :ref="account.reknr" />
                                            <small class="p-error" id="text-error">{{  account.errormsg || '&nbsp;' }}</small>
                                        </td>
                                        <td style="width:10%;">
                                            <Dropdown filter v-model="account.employee" :options="employeelist" optionLabel="employeedisplayname" optionValue="employeedisplayname" style="width:100%;" placeholder="社員を選択してください"
                                                      :class="[{ 'p-invalid': !account.employee }, 'w-full', 'md:w-10rem']" @change="updateCostCenter(account)" />
                                            <small class="p-error" id="epy-text-error">{{  account.epyerrormsg || '&nbsp;' }}</small>
                                        </td>
                                        <td style="width:10%;">
                                            <Dropdown filter v-model="account.costcenter" :options="uniqueCostcenters" optionLabel="costcenterdispalyname" optionValue="costcenterdispalyname" style="width:100%;" placeholder="コスト"
                                                      :class="[{ 'p-invalid': !account.costcenter }, 'w-full', 'md:w-10rem']" />
                                            <small class="p-error" id="cc-text-error">{{  account.ccerrormsg || '&nbsp;' }}</small>
                                        </td>
                                        <td style="width:5%;">
                                            <Button icon="pi pi-times" @click="removeRow(index)" severity="danger" text rounded aria-label="Cancel" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="編集続行" icon="pi pi-times" @click="amountdiff = false" severity="secondary" />
                        <Button label="Exactへ登録" icon="pi pi-database" @click="saveRepairedInvoice" />
                        <!--<Button type="submit" label="Submit" />-->
                    </template>
                </Dialog>
            </div>
            <div id="pagedisable" style="position: fixed; width: 100%; height: 100%; z-index: 1000; top: 0px; background-color: #EFEFEF; opacity: .7;" v-show="wholeloading">
            </div>
        </div>
    </form>
</template>


<script>
    import axios from "../../node_modules/axios/index";
    import { useToast } from "primevue/usetoast";
    import { defineAsyncComponent, ref, computed } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import dayjs from 'dayjs';
    import { CommonSetting } from "/service/CommonSetting.js";
    import { useField, useForm } from 'vee-validate';

    export default {
        beforeRouteLeave(to, from, next) {
            if (this.inputchange == true) {
                const inputElement = document.getElementById("inputText_" + this.alertindex);
                this.$nextTick(() => {
                    //inputElement.focus();
                    inputElement.classList.add("p-invalid");
                    inputElement.classList.add("p-focus");
                });
                const answer = window.confirm('登録されていない記録があります。画面遷移を続けてもよろしいですか。')
                if (!answer) {
                    next(false);
                    this.showmenu = false;
                } else {
                    next();
                }
            }
            else {
                next();
            }
        },
        setup() {
            const toast = useToast();
            const filters = ref();
            const initFilters = () => {
                filters.value = {
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                    blocked: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    date: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    fulfilmentdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    pono: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    description: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    qty: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    units: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    factor: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    received: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    invoicedperitempo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    ourref: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    youref: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    entrynumber: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    item: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    itemdescription: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    supplieritemcode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    serialbatchno: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    receiptid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    projectcode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    currencycode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    rate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    itemprice: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    outstanding: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    vat: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    vatcode: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    outstamtinclvat: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    amtorderedvat: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    glno: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    dataid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    costcenter: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    resourceid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    warehouse: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                };
            };
            initFilters();


            //const filters = ref({
            //    global: { value: null, matchMode: FilterMatchMode.CONTAINS },//製品タブの「キーワード検索」用
            //    blocked: { value: null, matchMode: FilterMatchMode.CONTAINS },//Blocked
            //    date: { value: null, matchMode: FilterMatchMode.CONTAINS },//日付
            //    fulfilmentdate: { value: null, matchMode: FilterMatchMode.CONTAINS },//納品日付
            //    pono: { value: null, matchMode: FilterMatchMode.CONTAINS },//発注番号
            //    description: { value: null, matchMode: FilterMatchMode.CONTAINS },//説明
            //    qty: { value: null, matchMode: FilterMatchMode.CONTAINS },//受注数
            //    units: { value: null, matchMode: FilterMatchMode.CONTAINS },//ユニット
            //    factor: { value: null, matchMode: FilterMatchMode.CONTAINS },//係数
            //    received: { value: null, matchMode: FilterMatchMode.CONTAINS },//受入数量
            //    invoicedperitempo: { value: null, matchMode: FilterMatchMode.CONTAINS },//請求済み(Per item+発注)
            //    unitsreceived: { value: null, matchMode: FilterMatchMode.CONTAINS },//ユニット(受入)
            //    ourref: { value: null, matchMode: FilterMatchMode.CONTAINS },//内部参照情報
            //    youref: { value: null, matchMode: FilterMatchMode.CONTAINS },//外部参照情報
            //    entrynumber: { value: null, matchMode: FilterMatchMode.CONTAINS },//エントリ番号
            //    item: { value: null, matchMode: FilterMatchMode.CONTAINS },//アイテム
            //    itemdescription: { value: null, matchMode: FilterMatchMode.CONTAINS },//品名
            //    supplieritemcode: { value: null, matchMode: FilterMatchMode.CONTAINS },//仕入先アイテムコード
            //    serialbatchno: { value: null, matchMode: FilterMatchMode.CONTAINS },//シリアル/バッチ番号
            //    receiptid: { value: null, matchMode: FilterMatchMode.CONTAINS },//受入/入金ID
            //    projectcode: { value: null, matchMode: FilterMatchMode.CONTAINS },//プロジェック
            //    currencycode: { value: null, matchMode: FilterMatchMode.CONTAINS },//通貨
            //    rate: { value: null, matchMode: FilterMatchMode.CONTAINS },//為替レート
            //    itemprice: { value: null, matchMode: FilterMatchMode.CONTAINS },//アイテム価格
            //    outstanding: { value: null, matchMode: FilterMatchMode.CONTAINS },//未決済
            //    vat: { value: null, matchMode: FilterMatchMode.CONTAINS },//消費税込
            //    vatcode: { value: null, matchMode: FilterMatchMode.CONTAINS },//消費税コード
            //    outstamtinclvat: { value: null, matchMode: FilterMatchMode.CONTAINS },//金額（税込）
            //    amtorderedvat: { value: null, matchMode: FilterMatchMode.CONTAINS },//税額
            //    glno: { value: null, matchMode: FilterMatchMode.CONTAINS },//勘定元帳
            //    dataid: { value: null, matchMode: FilterMatchMode.CONTAINS },//Data ID
            //    costcenter: { value: null, matchMode: FilterMatchMode.CONTAINS },//コストセンター
            //    resourceid: { value: null, matchMode: FilterMatchMode.CONTAINS },//リソースID
            //    warehouse: { value: null, matchMode: FilterMatchMode.CONTAINS },//倉庫コード

            //});
            const supplyfilters = ref();
            const initsupplyFilters = () => {
                supplyfilters.value = {
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                    blocked: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    inqno: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    customer: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    delivery: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    receiver: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    hrperson: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    officeperson: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    deliverperson: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    orderperson: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    class2: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    orddate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    hopedate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    shipdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    addupsdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    makerdelivery: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    confdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    itemtype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    saletype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    ep_cd: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    mai: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    text: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    text2: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    text3: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    customerdesiredno: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    excustomer: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exdelivery: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exreceiver: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exhrperson: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    excostcenter: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exdepartment: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exsupplier: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exvat: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },

                    slip: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//伝票番号
                    basicsup_cd: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//商品コード
                    itemname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//商品名称
                    exitem: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//Exact商品
                    q1: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//数量
                    sk2: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//金額（税抜）
                    examtinclvat: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//金額（税込）
                    orddate2: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//受注日
                    addupdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    shipsdate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    baandate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    makerreceive: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    msg: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exitemtype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exitemtypelocal: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exitem: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    nou_cd: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    iri: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    targetslip: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exitemtype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    processtype: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    exactstatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },

                };
            };
            initsupplyFilters();

            //    slip: { value: null, matchMode: FilterMatchMode.CONTAINS },//伝票番号
            //    basicsup_cd: { value: null, matchMode: FilterMatchMode.CONTAINS },//商品コード
            //    itemname: { value: null, matchMode: FilterMatchMode.CONTAINS },//商品名称
            //    exitem: { value: null, matchMode: FilterMatchMode.CONTAINS },//Exact商品
            //    q1: { value: null, matchMode: FilterMatchMode.CONTAINS },//数量
            //    sk2: { value: null, matchMode: FilterMatchMode.CONTAINS },//金額（税抜）
            //    examtinclvat: { value: null, matchMode: FilterMatchMode.CONTAINS },//金額（税込）
            //    orddate2: { value: null, matchMode: FilterMatchMode.CONTAINS },//受注日
            //    addupdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    shipsdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    baandate: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    makerreceive: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    msg: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    exitemtype: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    exitemtypelocal: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    exitem: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    nou_cd: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    iri: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    targetslip: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    exitemtype: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    processtype: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    exactstatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //});

            const historyfilters = ref();

            const inithistoryFilters = () => {
                historyfilters.value = {
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//「キーワード検索」用
                    global: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//製品タブの「キーワード検索」用
                    blocked: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },//Blocked
                    drflg: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    syscreated: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    datum: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    bkstnr: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    cmp_name: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    faktuurnr: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    docnumber: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    bedrag: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    oms25: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                    fullname: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                };
            };
            inithistoryFilters();

            //const historyfilters = ref({
            //    global: { value: null, matchMode: FilterMatchMode.CONTAINS },//製品タブの「キーワード検索」用
            //    blocked: { value: null, matchMode: FilterMatchMode.CONTAINS },//Blocked
            //    drflg: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    syscreated: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    datum: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    bkstnr: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    cmp_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    faktuurnr: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    docnumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    bedrag: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    oms25: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //    fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
            //});
            const errortoast = (msg) => {
                toast.add({ severity: 'error', summary: 'エラー', detail: msg, life: 5000 });//エラー発生時に、表示するToast
            };
            const infotoast = (msg) => {
                toast.add({ severity: 'info', summary: 'info', detail: msg, life: 3000 });//情報表示時に、表示するToast
            };
            const showmenu = ref(false);
            var popupWindow = null;
            const goToUrl = (url) => {
                event.preventDefault();
                popupWindow = window.open(url, 'popUpWindow', 'left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
            }

            const opsupplyitem = ref();
            const oppono = ref();

            const ponotoggle = (event) => {
                oppono.value.toggle(event);
            };
            const finalselectedopt = ref();
            const finaltoggle = (event) => {
                finalselectedopt.value.toggle(event);
            };
            const selectedsupply = ref([]);
            const employeelist = ref([]);
            const showSupplyItemDetail = (event, supplyinfo, inqno) => {
                event.preventDefault();
                if (supplyinfo.length > 0) {
                    selectedsupply.value = supplyinfo.filter(obj => {
                        return obj.inqno === inqno
                    });
                }
                opsupplyitem.value.toggle(event);
            }
            const showsupply = computed(() => {
                return selectedsupply.value.length > 0 ? selectedsupply.value[0] : null;
            });


            //ExACTへの登録のコストセンターのOPTION重複除く
            const uniqueCostcenters = computed(() => {
                const costcenterSet = new Set(employeelist.value.map(emp => emp.costcenterdispalyname));
                return Array.from(costcenterSet).map(costcenter => ({ costcenterdispalyname: costcenter }));
            });

            const helpMenu = () => {
                window.open('https://teraoka.atlassian.net/wiki/spaces/ISJP/pages/819691688?parentProduct=JSM-Portal&parentProductContentContainerId=10238&initialAllowedFeatures=disable-login-flow.disable-share&locale=ja-JP#%E8%AB%8B%E6%B1%82%E6%9B%B8%E7%99%BB%E9%8C%B2%E7%94%BB%E9%9D%A2', '_blank');
                document.body.click();
            };
            return {
                //errortoast, filters, infotoast, goToUrl, showmenu, CommonSetting, showSupplyItemDetail, opsupplyitem, ophistoryitem, showsupply, showHistoryItemDetail, optaxdisplay, showTaxList, opcostcenterdisplay, showCostCenterList, selectedDropDown, selectedField
                errortoast, filters, infotoast, goToUrl, showmenu, CommonSetting, showSupplyItemDetail, opsupplyitem, showsupply, supplyfilters, historyfilters, helpMenu, selectedsupply, employeelist, uniqueCostcenters, oppono, ponotoggle, finalselectedopt, finaltoggle
            };
        },
        props: ["invoiceid", "companycode", "invoiceamount", "creditorcode", "invoiceregisterdate", "billoneno", "newinvoices"],//URLから取得
        computed: {
            inputClasses() {
                return {
                    'form-control': true,
                    'is-invalid': this.showError
                };
            },
            ponobtnstyle() {
                return {
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    color: this.isClicked ? 'gray' : 'blue'
                };
            }
        },
        data() {
            return {
                productsearchboxloading: ref(false),
                supplysearchboxloading: ref(false),
                historysearchboxloading: ref(false),
                productsearchresult: "",//製品検索結果
                supplysearchresult: "",//サプライ品検索結果
                historysearchresult: "",//登録済請求書検索結果
                tooltipContent: ref(""),//登録済請求書PoNumber結果
                gllist: null,//仕訳帳リスト
                selectedgl: null,//選択した仕訳帳
                finalproductlinecolumns: [],//「製品」タブで表示されるテーブルのヘッダー設定データ
                finalproductlineselected: [],//「製品」タブ内のテーブルのヘッダーを表示/非表示設定データ
                supplylinecolumns: [],//「サプライ品」タブで表示されるテーブルのヘッダー設定データ
                supplylineselected: [],//「サプライ品」タブ内のテーブルのヘッダーを表示/非表示設定データ
                historylinecolumns: [],//「登録済請求書」タブで表示されるテーブルのヘッダー設定データ
                historylineselected: [],//「登録済請求書」タブ内のテーブルのヘッダーを表示/非表示設定データ
                /* selectedsupply: null,*/
                invoiceheaderinfo: {},//請求書のヘッダー情報を格納
                finalproductinfo: [],//「製品」タブで表示されるテーブルの行データ
                supplyinfo: [],//「サプライ品」タブで表示されるテーブルの行データ
                historyinfo: [],//「登録済請求書」タブで表示されるテーブルの行データ

                itemsearchbox: false,//「検索条件表示」に対応する項目等を表示/非表示設定用
                searchcontrol: {
                    "searchgroupby": "radnogroup",//「検索条件表示」に対応する項目、「 一覧の表示」
                    "txtinvoicedatefrom": "",//「検索条件表示」に対応する項目、「From」
                    "txtinvoicedateto": "",//「検索条件表示」に対応する項目、「To」
                    "txtiosdatefrom": "",//「検索条件表示」に対応する項目、IOS「From」
                    "txtiosdateto": "",//「検索条件表示」に対応する項目、IOS「To」
                    "txthistorydatefrom": "",//「検索条件表示」に対応する項目、登録済請求書「From」
                    "txthistorydateto": ""//「検索条件表示」に対応する項目、登録済請求書「To」
                },
                selected_finalproductlines: [],//「製品」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する
                selected_supplylines: [],//「サプライ品」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する
                selected_historylines: [],//「登録済請求書品」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する
                datecolumns: [],//日付型の列名を格納
                currencycolumns: [],//通貨型の列名を格納
                nodatamessage: "",//検索結果データがない場合のメッセージ
                supplynodatamessage: "",//サプライ品の検索結果データがない場合のメッセージ
                historynodatamessage: "",//登録済請求書の検索結果データがない場合のメッセージ
                selectedbilloneno: null,//選択したBillOne番号
                multiselectedbilloneno: [],//複数選択したBillOne番号
                selectedOption: ref([]),//複数選択したBillOne番号を登録済表示
                billonenos: [],//Billone番号リスト
                ponolist: [],//発注番号リスト
                accountlist: [],//督促金額を相殺リスト
                /*employeelist: ref([]),//社員リスト*/
                selectedaccountlist: ref([]),
                accesstoken: null,//Azure Functionへアクセス時のToken
                activetab: 0,//Tab選択
                amountdiff: false, //BillOne請求書の金額と選択したアイテムの合計金額が合わない場合
                amountrepairtype: "2", //金額調整
                nextinvoiceurl: null,//次の請求書URL
                previousinvoiceurl: null,//前の請求書URL
                wholeloading: true,//Loading中にページ操作不可能に設定
                taxlist: [], //税率リスト
                filteredtaxlist: [], //検索後の税率リスト
                filteredcostcenterlist: [], //検索後のコストセンターリスト
                costcenterlist: [], //コストセンターリスト
                filteredcostcenterlist: [], //検索後の税率リスト
                selectedDropDown: ref(), //税コード/コストセンターでF2キーを押下した場合、そのObjの値を保存
                selectedField: ref(),//F2キーを押下した場合、税コードかコストセンターかを保存
                selectedEvent: ref(),//F2キーを押下した場合、税コード/コストセンターのEventを保存
                loadkeywordcostcenter: false,//F2キーを押下した場合、コストセンター検索テキストボックスに表示するLoading Icon
                correctionlines: [], //調整金額リスト
                correctionamt: 0, //調整金額
                exactsave: 'Exactへ登録',
                presave: '事前登録',
                btnalert: '',
                exactbuttonstyle: {//Exactへ登録ボタンのスタイル
                    color: 'white',
                },
                prebuttonstyle: {//事前登録ボタンのスタイル
                    color: 'black',
                    'margin-left': '3px'
                },
                inputchange: false,
                alertindex: null,
                showError: false,
                showRemarkError: [],
                invoicedateclosed: null, //Exactで締切日になっているかをチェック用
                saveflag: "0",
                formerstatus: null
            }
        },
        mounted() {
            this.$auth.accessToken().then((accesstoken) => {
                this.accesstoken = accesstoken;
                this.defaultsetting();//初期値設定
                this.getGlList();//仕訳帳リストをDBより、取得
                this.getBilloneNoList();//BillOneリストをDBより、取得
                this.getAccountList();//督促金額を相殺リストをDBより、取得
                this.getEmployeeList();//社員リストをDBより、取得
                this.getInvoiceHeaderInfo();//請求書のヘッダー情報をDBより、取得
            });
            window.addEventListener('beforeunload', event => this.handleBeforeUnload(event));//画面リフレッシュ対応
        },
        methods: {
            handleBeforeUnload(event) {
                if (this.btnalert == ' *') {
                    event.returnValue = '登録されていない記録があります。画面遷移を続けてもよろしいですか。';
                }
            },
            gotoPrevious() {
                //alert(this.saveflag)
                //alert(this.formerstatus)
                if (this.saveflag == '0') {
                    if (this.invoiceheaderinfo.status == '0') {
                        this.$router.push({
                            name: 'dashboardinvoicenewlist',
                            params: {
                                datastatus: '新規', companycode: this.operationcompanycode, finalnewinvoicetbl: this.newinvoices
                            }
                        })
                    }
                    else if (this.invoiceheaderinfo.status == '1') {
                        this.$router.push({
                            name: 'dashboardinvoicelist',
                            params: {
                                datastatus: '一時登録中', companycode: this.operationcompanycode
                            }
                        })
                    }
                    else if (this.invoiceheaderinfo.status == '2') {
                        this.$router.push({
                            name: 'dashboardinvoicelist',
                            params: {
                                datastatus: 'Exactへ登録済', companycode: this.operationcompanycode
                            }
                        })
                    }
                    else {
                        this.$router.push({
                            name: 'dashboardinvoicelist',
                            params: {
                                datastatus: '事前登録', companycode: this.operationcompanycode
                            }
                        })
                    }
                }
                else {
                    if (this.formerstatus == '0') {
                        this.$router.push({
                            name: 'dashboardinvoicenewlist',
                            params: {
                                datastatus: '新規', companycode: this.operationcompanycode, finalnewinvoicetbl: this.newinvoices
                            }
                        })
                    }
                    else if (this.formerstatus == '1') {
                        this.$router.push({
                            name: 'dashboardinvoicelist',
                            params: {
                                datastatus: '一時登録中', companycode: this.operationcompanycode
                            }
                        })
                    }
                    else {
                        this.$router.push({
                            name: 'dashboardinvoicelist',
                            params: {
                                datastatus: '事前登録', companycode: this.operationcompanycode
                            }
                        })
                    }
                    this.saveflag = '0'
                }
            },
            remarkClasses(remark) {
                return {
                    'p-invalid': !remark || remark.trim() === '',
                };
            },
            updateCostCenter(account) {
                const selectedEmployee = this.employeelist.find(emp => emp.employeedisplayname === account.employee);
                if (selectedEmployee) {
                    account.costcenter = selectedEmployee.costcenterdispalyname;
                }
            },
            handleMust() {
                this.showError = this.invoiceheaderinfo.yourref.trim() === '';
            },
            handleRemark(account, index) {
                this.showRemarkError[index] = true;
                this.showRemarkError[index] = account.trim() === '';
                //console.log(this.showRemarkError[index]);
                //console.log(index);
            },
            removeRow(index) {
                this.selectedaccountlist[index].amount = 0;
                this.selectedaccountlist[index].remark = '';
                this.selectedaccountlist[index].employee = null;
                this.selectedaccountlist[index].costcenter = null;
                this.selectedaccountlist.splice(index, 1);
                this.recalculateEntryAmount();
                document.activeElement.blur();
            },
            handleInput(event, index) {
                this.inputchange = true;
                this.alertindex = index;//修正があった行のindexを保存
                this.btnalert = ' *'
                //this.exactsave = 'Exactへ登録 *';
                //this.presave = '事前登録 *';
                //this.exactbuttonstyle.color = 'red';
                //this.prebuttonstyle.color = 'red';
            },
            defaultsetting() {
                this.searchcontrol.txtinvoicedatefrom = CommonSetting.defaultStartDate(); //検索条件の「From」をデフォルトとして、「本日 - 6ヶ月」でセット
                this.searchcontrol.txtinvoicedateto = CommonSetting.defaultEndDate();//検索条件の「To」をデフォルトとして、「本日 + 6ヶ月」でセット
                this.searchcontrol.txtiosdatefrom = CommonSetting.defaultStartDate(); //検索条件のIOS「From」をデフォルトとして、「本日 - 6ヶ月」でセット
                this.searchcontrol.txtiosdateto = CommonSetting.defaultEndDate();//検索条件の「To」IOSをデフォルトとして、「本日 + 6ヶ月」でセット
                this.invoiceheaderinfo = {
                    "billoneinvamt": this.invoiceamount,
                    "billoneinvdate": (this.invoiceregisterdate == "NaN" || this.invoiceregisterdate == "1900-01-01" ? "" : this.invoiceregisterdate),
                    "companycode": this.companycode,
                    "entryinvamt": "",
                    "glname": "",
                    "glno": "",
                    "invoiceid": this.invoiceid,
                    "remark": "",
                    "reportdate": "",
                    "searchgroupby": "radnogroup",
                    "status": "0",
                    "vendorcode": this.creditorcode,
                    "vendorname": "",
                    "yourref": "",
                    "billoneno": this.billoneno,
                    "billoneurl": "",
                    "billoneinfo": "",
                    "newinvoiceid": ""
                };
                this.getTaxList();
                this.getCostCenterList();
                this.searchcontrol.txthistorydatefrom = CommonSetting.formatDate((new Date(dayjs((this.invoiceheaderinfo.billoneinvdate == "" || this.invoiceheaderinfo.billoneinvdate == "1900-01-01 00:00:00" ? new Date() : this.invoiceheaderinfo.billoneinvdate)).subtract(2, 'month'))));//検索条件の「From」をデフォルトとして、「billoneinvdate - 2ヶ月」でセット
                //this.searchcontrol.txthistorydateto = CommonSetting.formatDate((new Date(dayjs())));//検索条件の「To」をデフォルトとして、「billoneinvdate + 2ヶ月」でセット
                this.searchcontrol.txthistorydateto = CommonSetting.formatDate((new Date(dayjs((this.invoiceheaderinfo.billoneinvdate == "" || this.invoiceheaderinfo.billoneinvdate == "1900-01-01 00:00:00" ? new Date() : this.invoiceheaderinfo.billoneinvdate)).add(2, 'month'))));//検索条件の「To」をデフォルトとして、「billoneinvdate + 2ヶ月」でセット
                if (this.invoiceid.startsWith('NaN')) {
                    this.invoiceheaderinfo.status = "3";
                }
                CommonSetting.getAllMenu(this.$auth.getCurrentUser().username, this.accesstoken).then((data) => (this.menulist = data));
                this.getMoveInvoiceURL();
            },
            getMoveInvoiceURL() {
                if (this.newinvoices != undefined) {
                    var params = {
                        "companycode": this.companycode,
                        "newinvoices": this.newinvoices,
                        "billoneno": this.billoneno
                    };
                    /* console.log(JSON.stringify(params));*/
                    axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceDetailMoveURL'
                        , params).then(
                            response => (
                                this.nextinvoiceurl = JSON.parse(response.data)[0].nexturl, this.previousinvoiceurl = JSON.parse(response.data)[0].prevurl
                            )
                        ).catch(error => {
                            if (JSON.stringify(error).indexOf("401") >= 0) {
                                window.location.reload();
                            }
                        });
                }
            },
            moveinvoice(invoiceurl) {
                window.location.href = invoiceurl;
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
            gotoMenu() {
                this.showmenu = true;
                CommonSetting.restyleSideBar();
            },
            setTableHeader(datatype) {
                switch (datatype) {
                    case "radnogroup"://「 一覧の表示＝なし」の場合、以下の設定
                        this.finalproductlinecolumns = [
                            { field: 'blocked', header: 'Blocked' },
                            { field: 'date', header: '日付' },
                            { field: 'fulfilmentdate', header: '納品日付' },
                            { field: 'pono', header: '発注番号' },
                            { field: 'description', header: '説明' },
                            { field: 'qty', header: '数量' },
                            { field: 'units', header: 'ユニット' },
                            { field: 'factor', header: '係数' },
                            { field: 'received', header: '受入' },
                            { field: 'invoicedperitempo', header: '請求済み(Per item+発注)' },
                            { field: 'unitsreceived', header: 'ユニット(受入)' },
                            { field: 'ourref', header: '内部参照情報' },
                            { field: 'yourref', header: '外部参照情報' },
                            { field: 'entrynumber', header: 'エントリ番号' },
                            { field: 'item', header: 'アイテム' },
                            { field: 'itemdescription', header: '品名' },
                            { field: 'supplieritemcode', header: '仕入先アイテムコード' },
                            { field: 'serialbatchno', header: 'シリアル/バッチ番号' },
                            { field: 'receiptid', header: '受入/入金ID' },
                            { field: 'projectcode', header: 'プロジェック' },
                            { field: 'currencycode', header: '通貨' },
                            { field: 'rate', header: '為替レート' },
                            { field: 'itemprice', header: 'アイテム価格' },
                            { field: 'outstanding', header: '金額（税抜）' },
                            { field: 'vat', header: '税額' },
                            { field: 'vatcode', header: '税コード' },
                            { field: 'outstamtinclvat', header: '金額（税込）' },
                            { field: 'glno', header: '勘定元帳' },
                            { field: 'dataid', header: 'Data ID' },
                            { field: 'costcenter', header: 'コストセンター' },
                            { field: 'resourceid', header: 'リソースID' },
                            { field: 'warehouse', header: '倉庫コード' }
                        ];
                        this.finalproductlineselected = [
                            { field: 'fulfilmentdate', header: '納品日付' },
                            { field: 'warehouse', header: '倉庫コード' },
                            { field: 'pono', header: '発注番号' },

                            //{ field: 'glno', header: '勘定元帳' },
                            { field: 'item', header: 'アイテム' },
                            { field: 'itemdescription', header: '品名' },
                            { field: 'qty', header: '数量' },
                            { field: 'vatcode', header: '税コード' },
                            { field: 'outstanding', header: '金額（税抜）' },
                            { field: 'vat', header: '税額' },
                            { field: 'outstamtinclvat', header: '金額（税込）' },
                            { field: 'description', header: '説明' },
                            /*{ field: 'costcenter', header: 'コストセンター' }*/
                            //{ field: 'received', header: '受入' },

                            //{ field: 'serialbatchno', header: 'シリアル/バッチ番号' },
                            //{ field: 'itemprice', header: 'アイテム価格' },
                            //{ field: 'outstamtinclvat', header: '未決算価格消費税込' }
                            // { field: 'pono', header: '発注番号' },
                        ];
                        break;

                    case "radpogroup"://「 一覧の表示＝アイテム」の場合、以下の設定
                        this.finalproductlinecolumns = [
                            { field: 'blocked', header: 'Blocked' },
                            { field: 'date', header: '日付' },
                            { field: 'fulfilmentdate', header: '納品日付' },
                            { field: 'pono', header: '発注番号' },
                            { field: 'description', header: '説明' },
                            { field: 'youref', header: '外部参照情報' },
                            { field: 'qty', header: '受注数' },
                            { field: 'units', header: 'ユニット' },
                            { field: 'factor', header: '係数' },
                            { field: 'received', header: '数量' },
                            { field: 'invoicedperitempo', header: '請求済' },
                            { field: 'unitsreceived', header: '数量(未決済)' },
                            { field: 'unitsoutstand', header: 'ユニット(未決済)' },
                            { field: 'item', header: 'アイテム' },
                            { field: 'itemdescription', header: '品名' },
                            { field: 'supplieritemcode', header: '仕入先アイテムコード' },
                            { field: 'itemprice', header: 'アイテム価格' },
                            { field: 'currencycode', header: '通貨' },
                            { field: 'rate', header: '為替レート' },
                            { field: 'projectcode', header: 'プロジェック' },
                            { field: 'outstanding', header: '金額（税抜）' },
                            { field: 'vatcode', header: '税コード' },
                            { field: 'amtorderedvat', header: '税額' },
                            { field: 'outstamtinclvat', header: '金額（税込）' },
                            { field: 'transsubtype', header: '取引タイプ' },
                            { field: 'reknr', header: '勘定元帳' },
                            { field: 'costcenter', header: 'コストセンター' },
                            { field: 'resourceid', header: 'リソースID' },
                            { field: 'warehouse', header: '倉庫コード' }
                        ];
                        this.finalproductlineselected = [
                            { field: 'fulfilmentdate', header: '納品日付' },
                            { field: 'warehouse', header: '倉庫コード' },
                            { field: 'pono', header: '発注番号' },
                            { field: 'item', header: 'アイテム' },
                            { field: 'itemdescription', header: '品名' },
                            { field: 'received', header: '数量' },
                            { field: 'vatcode', header: '税コード' },
                            { field: 'outstanding', header: '金額（税抜）' },
                            { field: 'amtorderedvat', header: '税額' },
                            { field: 'outstamtinclvat', header: '金額（税込）' },
                            { field: 'description', header: '説明' },
                            /*{ field: 'costcenter', header: 'コストセンター' },*/

                            //{ field: 'youref', header: '外部参照情報' },
                            //{ field: 'itemprice', header: 'アイテム価格' },
                            //{ field: 'outstamtinclvat', header: '未決算価格消費税込' },
                            //{ field: 'costcenter', header: 'コストセンター' }
                        ];
                        break;
                    default:
                }

                this.supplylinecolumns = [
                    { field: 'inqno', header: '問合せ番号' },
                    { field: 'customer', header: 'IOS顧客' },
                    { field: 'delivery', header: 'IOS納品先' },
                    { field: 'receiver', header: 'IOS請求先' },
                    { field: 'hrperson', header: 'IOS担当者' },
                    { field: 'officeperson', header: 'IOS営業所' },
                    { field: 'deliverperson', header: '出荷担当' },
                    { field: 'orderperson', header: '発注先' },
                    { field: 'class2', header: '直行区分' },
                    { field: 'orddate', header: '発注日' },
                    { field: 'hopedate', header: '納品希望日' },
                    { field: 'shipdate', header: '出荷日' },
                    { field: 'addupsdate', header: '納品処理日' },
                    { field: 'makerdelivery', header: 'メーカー送信（日）' },
                    { field: 'confdate', header: 'オーダー確認日' },
                    { field: 'itemtype', header: '商品分類' },
                    { field: 'saletype', header: '売上分類' },
                    { field: 'ep_cd', header: 'ePlace商品コード' },
                    { field: 'basicsup_cd', header: '発注先商品コード' },
                    { field: 'mai', header: '1巻当り枚数' },
                    { field: 'text', header: '備考欄' },
                    { field: 'text2', header: '通信欄' },
                    { field: 'text3', header: '出荷メッセージ' },
                    { field: 'customerdesiredno', header: '顧客指定番号' },
                    { field: 'slip', header: '伝票番号' },
                    { field: 'excustomer', header: 'Exact顧客' },
                    { field: 'exdelivery', header: 'Exact納品先' },
                    { field: 'exreceiver', header: 'Exact請求先' },
                    { field: 'exhrperson', header: 'Exact担当者' },
                    { field: 'excostcenter', header: 'Exactコストセンター' },
                    { field: 'exdepartment', header: 'Exact部門' },
                    { field: 'exsupplier', header: 'Exact仕入先' },
                    { field: 'exvat', header: '税コード' },
                    { field: 'exvatamt', header: '税額' },
                    { field: 'examtinclvat', header: '金額(税込)' },
                    { field: 'orddate2', header: '受注日' },
                    { field: 'addupdate', header: '納品日' },
                    { field: 'shipsdate', header: '出荷処理日' },
                    { field: 'baandate', header: 'データ送信日' },
                    { field: 'makerreceive', header: 'メーカー受信（日）' },
                    { field: 'msg', header: '連絡' },
                    { field: 'exitemtype', header: 'Exact品目区分' },
                    { field: 'exitemtypelocal', header: '品目区分（ローカル）' },
                    { field: 'exitem', header: 'Exact商品' },
                    { field: 'nou_cd', header: '出荷担当納品先コード' },
                    { field: 'iri', header: '入数' },
                    { field: 'targetslip', header: '対象伝票番号' },
                    { field: 'processtype', header: '処理区分' },
                    { field: 'drflg', header: '納品区分' },
                    { field: 'itemname', header: '商品名称' },
                    { field: 'basicsup_cd', header: '商品コード' },
                    { field: 'q1', header: '数量' },
                    { field: 'sk2', header: '金額（税抜）' },
                    { field: 'exactstatus', header: '受入' },
                    { field: 'exccc1', header: '部門1' },
                    { field: 'exccc2', header: '部門2' },
                    { field: 'exccc3', header: '部門3' }
                ];
                this.supplylineselected = [
                    { field: 'shipdate', header: '出荷日' },
                    { field: 'officeperson', header: 'IOS営業所' },
                    { field: 'slip', header: '伝票番号' },
                    { field: 'basicsup_cd', header: '商品コード' },
                    { field: 'itemname', header: '商品名称' },
                    //{ field: 'exitem', header: 'Exact商品' },
                    { field: 'q1', header: '数量' },
                    { field: 'exvat', header: '税コード' },
                    { field: 'sk2', header: '金額（税抜）' },
                    { field: 'exvatamt', header: '税額' },
                    { field: 'examtinclvat', header: '金額(税込)' },
                    // { field: 'orddate2', header: '受注日' },
                    // { field: 'processtype', header: '処理区分' },
                    { field: 'exactstatus', header: '受入' },
                    /*{ field: 'exdelivery', header: 'Exact納品先' }*/
                    /*{ field: 'excostcenter', header: 'Exactコストセンター' }*/


                ];

                this.historylinecolumns = [
                    { field: 'pono', header: '発注番号' },//2024-05-14ニュートン追加
                    { field: 'syscreated', header: 'レポート日付' },
                    { field: 'datum', header: '日付' },
                    { field: 'bkstnr', header: 'エントリ番号' },
                    { field: 'cmp_name', header: '仕入先' },
                    { field: 'faktuurnr', header: '内部参照情報' },
                    { field: 'docnumber', header: '外部参照情報' },
                    { field: 'bedrag', header: '請求金額' },
                    { field: 'oms25', header: '説明' },
                    { field: 'fullname', header: '作成者' }

                ];
                this.historylineselected = [
                    { field: 'pono', header: '発注番号' },//2024-05-14ニュートン追加
                    { field: 'syscreated', header: 'レポート日付' },
                    { field: 'datum', header: '日付' },
                    { field: 'bkstnr', header: 'エントリ番号' },
                    { field: 'faktuurnr', header: '内部参照情報' },
                    { field: 'docnumber', header: '外部参照情報' },
                    { field: 'bedrag', header: '請求金額' },
                    { field: 'oms25', header: '説明' },
                    { field: 'fullname', header: '作成者' }
                ];


                this.datecolumns = ['date', 'fulfilmentdate', 'orddate', 'hopedate', 'shipdate', 'addupsdate', 'confdate', 'orddate2', 'addupdate', 'shipsdate', 'baandate', 'syscreated', 'datum'];
                this.currencycolumns = ['itemprice', 'outstanding', 'vat', 'outstamtinclvat', 'sk2', 'bedrag', 'exvatamt', 'examtinclvat'];
                this.inputtextcolumns = ['oms25'];
            },
            changeSearchGroup(event) {// 一覧の表示ラジオボタンを切り替えた際の、関数
                if (this.selected_finalproductlines.length > 0) {
                    this.$confirm.require({
                        group: 'positionDialog',
                        message: '「 一覧の表示」を切り替える場合、選択中の製品が全てクリアされますが、よろしいですか❓❓❓',
                        header: '確認',
                        icon: 'pi pi-info-circle',
                        position: 'top',
                        accept: () => {
                            this.setTableHeader(event.target.value); //ヘッダー情報を切り替える
                            this.selected_finalproductlines = [];//選択中の全製品をクリア
                            this.infotoast("選択中の製品が全てクリアされました。");
                            this.searchcontrol.searchgroupby = event.target.value;//選択した値をセット
                            this.invoiceheaderinfo.entryinvamt = 0;//金額をリセット
                        },
                        reject: () => {
                            document.getElementById(this.searchcontrol.searchgroupby.toString()).checked = true;//元の選択氏へ戻す
                        }
                    });
                } else {
                    this.setTableHeader(event.target.value); //ヘッダー情報を切り替える
                    this.searchcontrol.searchgroupby = event.target.value;//選択した値をセット
                }
            },
            searchTaxList(event, obj) {
                var self = this;
                setTimeout(() => {
                    if (!event.query.trim().length) {
                        this.filteredtaxlist = [...self.taxlist];
                    } else {
                        this.filteredtaxlist = this.taxlist.filter((obj) => {
                            return obj.btwtrans.toLowerCase().includes(event.query.toLowerCase());
                        });
                    }
                }, 100);
            },
            searchCostCenterList(event, value) {
                var self = this;
                setTimeout(() => {
                    if (!event.query.trim().length) {
                        this.filteredcostcenterlist = [...self.costcenterlist];
                    } else {
                        this.filteredcostcenterlist = this.costcenterlist.filter((obj) => {
                            return obj.kstplcode.toLowerCase().includes(event.query.toLowerCase());
                        });
                    }
                }, 100);
            },
            getTableStatusClass() {
                var tblstatus = {
                    "0": "table-active",
                    "1": "table-warning",
                    "2": "table-primary",
                    "3": "table-info"
                };
                return tblstatus[this.invoiceheaderinfo.status];
            },
            getProductHeaderStyle() {
                var tblheaderstyle = {
                    "0": "",
                    "1": "background-color:  #fff3cd",
                    "2": "background-color: #cfe2ff",
                    "3": "background-color: #c0eae9"
                };
                return tblheaderstyle[this.invoiceheaderinfo.status];
            },
            getGlList() { //仕訳帳リストを取得し、選択ボックスで表示
                var params = {
                    "companycode": this.companycode
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetJournalList'
                    , params).then(
                        response => (
                            this.gllist = JSON.parse(response.data)
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getTaxList() { //消費税リストを取得し、選択ボックスで表示
                var params = {
                    "companycode": this.companycode
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetTaxList'
                    , params).then(
                        response => (
                            this.taxlist = JSON.parse(response.data)
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getBilloneNoList() {
                var params = {
                    "companycode": this.companycode,
                    "creditorno": this.creditorcode,
                    "billonenolist": this.invoiceheaderinfo.billoneno
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetBillOneNoList'
                    , params).then(
                        response => (
                            this.billonenos = JSON.parse(response.data),
                            console.log(this.billonenos),
                            /*this.multiselectedbilloneno = [this.billonenos.find(option => option.billoneno === this.$route.params.billoneno)],//Multiの請求書をデフォルト設定*/
                            this.multiselectedbilloneno = this.$route.params.billoneno.split('，').map(billoneno =>
                                this.billonenos.find(option => option.billoneno === billoneno)
                            ),
                            this.selectedOption = this.multiselectedbilloneno
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            handlePonoList(event, data) {
                this.getPonoList(data);
                this.ponotoggle(event);
            },
            handleFinalList(event) {
                this.finaltoggle(event);
            },
            getPonoList(entryno) {
                var params = {
                    //"companycode": 540,
                    //"entryno": "59880446"
                    "companycode": this.companycode,
                    "entryno": entryno
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetPONOList'
                    , params).then(
                        response => (
                            this.ponolist = JSON.parse(response.data),
                            /*this.ponolist.push({ PoNumber: "68166369" }), //2行以上のテスト*/
                            this.tooltipContent = this.ponolist.map(item => item.PoNumber).join('\n').replace(/\n/g, '<br>')//空欄を<br>に変換

                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getAccountList() {
                var params = {
                    "companycode": this.companycode,
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetAccountList'
                    , params).then(
                        response => (
                            this.accountlist = JSON.parse(response.data)
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            getEmployeeList() {
                var params = {
                    "companycode": this.companycode,
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetEmployeeList'
                    , params).then(
                        response => (
                            this.employeelist = JSON.parse(response.data)
                        )

                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            searchItem() {//検索ボタンを押下した際に、実行される関数
                this.itemsearchbox = false; // 検索処理実施後、 「検索条件表示」に対応する項目等を非表示に設定
                this.getReceiptItemInfo();
            },
            searchSupply() {//検索ボタンを押下した際に、実行される関数
                this.itemsearchbox = false; // 検索処理実施後、 「検索条件表示」に対応する項目等を非表示に設定
                this.getSupplyItemInfo();
            },
            searchHistory() {//履歴の検索ボタンを押下した際に、実行される関数
                this.itemsearchbox = false; // 検索処理実施後、 「検索条件表示」に対応する項目等を非表示に設定
                this.getPurchaseInvoiceHistoryByCreditor();
            },
            cancelSearch() {
                this.itemsearchbox = false;//「キャンセル」ボタンを押下した際、 「検索条件表示」に対応する項目等を非表示に設定
            },
            changeGlNo(event) {//仕訳帳選択ボックスでの値を切り替える際に、実行される関数
                this.invoiceheaderinfo.glno = this.selectedgl.journal;//選択した仕訳帳のNo.を表示
                this.invoiceheaderinfo.glname = this.selectedgl.description;
            },
            changeBLOneNo() {
                this.invoiceheaderinfo.newinvoiceid = this.selectedbilloneno.invoiceno;
                this.invoiceheaderinfo.billoneno = this.selectedbilloneno.billoneno;
                this.invoiceheaderinfo.billoneinvamt = this.selectedbilloneno.invoiceamount;
                this.invoiceheaderinfo.billoneinfo = this.selectedbilloneno.billoneinfo;
                this.invoiceheaderinfo.billoneinvdate = this.selectedbilloneno.invoicecreateddate;
                if (this.invoiceheaderinfo.yourref.length <= 0) {
                    this.invoiceheaderinfo.yourref = "BillOne番号_" + this.invoiceheaderinfo.billoneno;
                }
            },
            changeMultiBLOneNo() {
                this.invoiceheaderinfo.newinvoiceid = this.multiselectedbilloneno.map(item => item.invoiceno).join('，');
                this.invoiceheaderinfo.billoneno = this.multiselectedbilloneno.map(item => item.billoneno).join('，');
                this.invoiceheaderinfo.billoneinvamt = this.multiselectedbilloneno.reduce((sum, item) => sum + item.invoiceamount, 0);
                this.invoiceheaderinfo.billoneinfo = this.multiselectedbilloneno.map(item => item.billoneinfo).join('，');
                if (this.multiselectedbilloneno.length > 1) {
                    this.invoiceheaderinfo.billoneinvdate = null
                }
                else if (this.multiselectedbilloneno.length > 0) {
                    this.invoiceheaderinfo.billoneinvdate = this.multiselectedbilloneno[0].invoicecreateddate
                }
                else { }
                /*this.invoiceheaderinfo.billoneinvdate = this.multiselectedbilloneno.map(item => item.invoicecreateddate).join('、') ; */
                this.invoiceheaderinfo.yourref = "BillOne番号_" + this.invoiceheaderinfo.billoneno;

            },
            focusNext(event) {//データ入力後に、次の項目へカーソルを移動
                if (event == "txtyourref") { this.invoiceheaderinfo.reportdate = dayjs(this.invoiceheaderinfo.reportdate).format('YYYY-MM-DD'); }
                if (typeof event == "string") {
                    if (event.includes("date")) {
                        Array.from(document.getElementById(event).querySelectorAll('input'))[0].focus();
                    } else {
                        setTimeout(function () {
                            document.getElementById(event).focus();
                        }, 200);
                    }
                    return;
                }
                var elem = event.target;//カーソルセット中のObjectを取得
                const allItems = document.getElementById("headerinfo").querySelectorAll('input, textarea, select');//From内のカーソルセット対象の全Objectを取得。
                const currentIndex = Array.from(allItems).indexOf(elem);;//カーソルセット中のObject Indexを取得
                allItems.item(
                    currentIndex < allItems.length - 1 ?
                        currentIndex + 1 :
                        0
                ).focus();//次の項目へカーソルを移動
            },
            getInvoiceHeaderInfo() {//請求書のヘッダー情報を取得
                let self = this;
                console.log(JSON.stringify(this.invoiceheaderinfo));
                let headerinfo = axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceHeader'
                    , this.invoiceheaderinfo).then(
                        function (response) {
                            self.invoiceheaderinfo = JSON.parse(response.data)[0];//DBに登録された請求書のヘッダー情報をセット
                            if (self.invoiceheaderinfo.status == '2') self.getInvoiceCorrectionLineInfo(); //調整金額
                            self.searchcontrol.searchgroupby = self.invoiceheaderinfo.searchgroupby;
                            self.setTableHeader(self.invoiceheaderinfo.searchgroupby);//「製品」タブ内のテーブルを「 一覧の表示＝なし/アイテム」に切り替える
                            self.checkValidInvoiceDate();
                            setTimeout(function () {
                                if (self.gllist != null) self.selectedgl = self.gllist.find((o) => { return o["journal"] === self.invoiceheaderinfo.glno });//デフォルトの仕訳をセット
                            }, 300);
                            if (self.invoiceheaderinfo.status == "0" || self.invoiceheaderinfo.status == "1" || self.invoiceheaderinfo.status == "3") {//新規または一時登録中の請求書である場合
                                if (self.invoiceheaderinfo.invoicetype.includes("Product") || self.invoiceheaderinfo.invoicetype == "") {
                                    self.getReceiptItemInfo();//検索対象期間内の全受領済アイテムを抽出
                                }
                                if (self.invoiceheaderinfo.invoicetype.includes("Supply")) {
                                    self.activetab = 1;
                                    self.getSupplyItemInfo();
                                }
                            }
                            if (self.invoiceheaderinfo.status != "0") {//新規登録以外の場合
                                if (self.invoiceheaderinfo.invoicetype.includes("Product")) {
                                    self.getFinalProductSelectedLine();//前回の選択したアイテムリストを取得
                                }
                                if (self.invoiceheaderinfo.invoicetype.includes("Supply")) {
                                    self.activetab = 1;
                                    self.getSupplySelectedLine();
                                }
                                self.getInvoiceHistorySelectedLine();
                            }
                            self.wholeloading = false;
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getReceiptItemInfo() {//マッピング対象の製品リストをDBより取得
                var self = this;
                this.itemsearchbox = false;
                this.finalproductinfo = [];
                this.productsearchboxloading = ref(true);
                var params = {
                    "searchgroupby": this.searchcontrol.searchgroupby,
                    "companycode": this.companycode,
                    "creditorno": this.invoiceheaderinfo.vendorcode,
                    "invtobereceivedfrom": this.searchcontrol.txtinvoicedatefrom,
                    "invtobereceivedto": this.searchcontrol.txtinvoicedateto,
                    "invoiceid": this.invoiceid,
                };
                //console.log(JSON.stringify(params));
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetReceiptInfo'
                    , params).then(
                        function (response) {
                            self.finalproductinfo = JSON.parse(response.data);
                            self.productsearchboxloading = ref(false);
                            self.productsearchresult = "製品：" + self.finalproductinfo.length + "件";
                            if (self.finalproductinfo.length == 0) {
                                self.nodatamessage = "<div><b>以下の検索条件に対応する受入済アイテムがありません。</b><br />\
                                    <table><tr><td>仕入先　</td><td>"+ self.invoiceheaderinfo.vendorname + "</td></tr>\
                                    <tr><td>日付　</td> <td>"+ CommonSetting.formatDate(self.searchcontrol.txtinvoicedatefrom) + " ～ " + CommonSetting.formatDate(self.searchcontrol.txtinvoicedateto) + "</td></tr>\
                                    </table></div>";
                            } else {
                                self.nodatamessage = "";
                            }
                            setTimeout(function () {//Filterボックスの余分スペースを削除
                                const elements = document.getElementsByClassName("p-hidden-space");
                                while (elements.length > 0) elements[0].remove();
                            }, 500);
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getSupplyItemInfo() {
                var self = this;
                this.itemsearchbox = false;
                //this.finalproductinfo = [];
                this.supplysearchboxloading = ref(true);
                var params = {
                    "companycode": this.companycode,
                    "creditorcode": this.creditorcode,
                    "invoiceid": this.invoiceid,
                    "shipdatefrom": this.searchcontrol.txtiosdatefrom,
                    "shipdateto": this.searchcontrol.txtiosdateto
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetSupplyItemInfo'
                    , params).then(
                        function (response) {
                            self.supplyinfo = JSON.parse(response.data);
                            self.supplysearchboxloading = ref(false);
                            self.supplysearchresult = "サプライ品検索結果：" + self.supplyinfo.length + "件";
                            if (self.supplyinfo.length == 0) {
                                self.supplynodatamessage = "<div><b>以下の仕入先に対応する発注情報がありません。</b><br />\
                                    <table><tr><td>仕入先　</td><td>"+ self.invoiceheaderinfo.vendorname + "</td></tr>\
                                    </table></div>";
                            } else {
                                self.supplynodatamessage = "";
                            }
                            setTimeout(function () {//Filterボックスの余分スペースを削除
                                const elements = document.getElementsByClassName("p-hidden-space");
                                while (elements.length > 0) elements[0].remove();
                            }, 500);
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            getPurchaseInvoiceHistoryByCreditor() {
                var self = this;
                this.itemsearchbox = false;
                //this.finalproductinfo = [];
                this.historysearchboxloading = ref(true);
                var params = {
                    "companycode": this.companycode,
                    "invoiceid": this.invoiceheaderinfo.invoiceid,
                    "glno": this.invoiceheaderinfo.glno,
                    "vendorcode": this.invoiceheaderinfo.vendorcode,
                    "datefrom": dayjs(this.searchcontrol.txthistorydatefrom).format('YYYY-MM-DD'),
                    "dateto": dayjs(this.searchcontrol.txthistorydateto).format('YYYY-MM-DD')
                };
                console.log(JSON.stringify(params));
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetPurchaseInvoiceHistoryByCreditor'
                    , params).then(
                        function (response) {
                            self.historyinfo = JSON.parse(response.data);
                            self.historysearchboxloading = ref(false);
                            self.historysearchresult = "登録済請求書検索結果：" + self.historyinfo.length + "件";
                            if (self.historyinfo.length == 0) {
                                self.historynodatamessage = "<div><b>以下の仕入先に対応する履歴情報がありません。</b><br />\
                                    <table><tr><td>仕入先　</td><td>"+ self.invoiceheaderinfo.vendorname + "</td></tr>\
                                    </table></div>";
                            } else {
                                self.historynodatamessage = "";
                            }
                            setTimeout(function () {//Filterボックスの余分スペースを削除
                                const elements = document.getElementsByClassName("p-hidden-space");
                                while (elements.length > 0) elements[0].remove();
                            }, 500);
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            getFinalProductSelectedLine() {
                var self = this;
                var params = {
                    "companycode": this.companycode,
                    "invoiceheaderinfo": this.invoiceheaderinfo
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceLineInfo'
                    , params).then(
                        function (response) {
                            if (self.invoiceheaderinfo.status == "2") {
                                self.finalproductinfo = JSON.parse(response.data);
                                self.productsearchboxloading = ref(false);
                            } else if (self.invoiceheaderinfo.status == "1" || self.invoiceheaderinfo.status == "3") {
                                self.selected_finalproductlines = JSON.parse(response.data);
                            }
                            self.productsearchresult = "製品検索結果：" + self.finalproductinfo.length + "件";
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            getSupplySelectedLine() {
                var self = this;
                var params = {
                    "companycode": this.companycode,
                    "invoiceheaderinfo": this.invoiceheaderinfo
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetSupplyLineInfo'
                    , params).then(
                        function (response) {
                            if (self.invoiceheaderinfo.status == "2") {
                                self.supplyinfo = JSON.parse(response.data);
                                self.supplysearchboxloading = ref(false);
                                if (self.supplyinfo.length == 0) {
                                    self.supplynodatamessage = "<div><b>以下の仕入先に対応する発注情報がありません。</b><br />\
                                    <table><tr><td>仕入先　</td><td>"+ self.invoiceheaderinfo.vendorname + "</td></tr>\
                                    </table></div>";
                                } else {
                                    self.supplynodatamessage = "";
                                }
                            } else if (self.invoiceheaderinfo.status == "1" || self.invoiceheaderinfo.status == "3") {
                                self.selected_supplylines = JSON.parse(response.data);
                            }
                            self.supplysearchresult = "サプライ品検索結果：" + self.supplyinfo.length + "件";
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            getInvoiceHistorySelectedLine() {
                var self = this;
                var params = {
                    "companycode": this.companycode,
                    "invoiceheaderinfo": this.invoiceheaderinfo
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceHistoryLineInfo'
                    , params).then(
                        function (response) {

                            if (self.invoiceheaderinfo.status == "2") {
                                self.historyinfo = JSON.parse(response.data);
                                self.historysearchboxloading = ref(false);
                            } else if (self.invoiceheaderinfo.status == "1" || self.invoiceheaderinfo.status == "3") {
                                self.selected_historylines = JSON.parse(response.data);
                            }
                            self.historysearchresult = "登録済請求書検索結果：" + self.historyinfo.length + "件";
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },

            validateSave(pattern) {//「Exactへ登録」または「一時登録」ボタンを押下した際に、データ入力をチェック
                if (this.invoiceheaderinfo.billoneinvdate == null) {//「日付」がブランクの場合
                    document.getElementById("txtbillonedate").focus();
                    document.getElementById("txtbillonedate").classList.add("p-invalid");
                    this.errortoast("日付を選択してください。");
                    return false;
                }

                if (this.invoiceheaderinfo.billoneinvdate == null) {//「日付」がブランクの場合
                    document.getElementById("txtbillonedate").focus();
                    document.getElementById("txtbillonedate").classList.add("p-invalid");
                    this.errortoast("社員を選択してください。");
                    return false;
                }

                if (this.invoiceheaderinfo.reportdate == "") {//「レポート日付」がブランクの場合、「日付」の値をセット
                    this.invoiceheaderinfo.reportdate = this.invoiceheaderinfo.billoneinvdate;
                }
                if (this.invoiceheaderinfo.glno.length <= 0) {//「仕訳」が選択されていない場合
                    document.getElementById("selglno").focus();
                    document.getElementById("selglno").classList.add("p-focus p-invalid");
                    this.errortoast("該当仕訳を選択してください。");
                    return false;
                }
                if (this.invoiceheaderinfo.yourref.length <= 0 && pattern == "3") {//Exactへ登録中に「外部参照情報」が入力されてない場合
                    document.getElementById("txtyourref").focus();
                    document.getElementById("txtyourref").classList.add("is-invalid");
                    this.errortoast("外部参照情報を入力してください。");
                    return false;
                }
                else {
                    document.getElementById("txtyourref").classList.remove("is-invalid");
                }
                if (this.selected_finalproductlines.length + this.selected_supplylines.length <= 0) {//「製品」または「サプライ品」が選択されていない場合
                    this.errortoast("請求書明細が選択されていません。");
                    return false;
                }
                return true;
            },
            callOutSave(functionname) {
                eval("this." + functionname);
            },
            saveAsTemp() {//「一時登録」ボタンを押下した際の処理
                var pattern = "1";
                if (!this.validateSave(pattern)) return;//データ入力をチェックし、エラーがある場合、処理を中断
                this.saveToBillOneDB("1");
            },
            saveAsPrior() {//「事前登録」ボタンを押下した際の処理
                var pattern = "2";
                if (!this.validateSave(pattern)) return;//データ入力をチェックし、エラーがある場合、処理を中断
                this.saveToBillOneDB("3");
                this.btnalert = '';
                this.inputchange == false;
            },
            saveToExact() {//「Exactへ登録」ボタンを押下した際の処理
                var pattern = "3";
                if (!this.validateSave(pattern)) return;//データ入力をチェックし、エラーがある場合、処理を中断
                if (this.invoiceheaderinfo.status == '3' && this.invoiceheaderinfo.billoneno == "") {
                    document.getElementById("selbilloneno").classList.add("p-focus");
                    document.getElementById("selbilloneno").classList.add("p-invalid");
                    this.errortoast("Bill One仕入請求を選択してください。");
                    return;
                }
                if (this.invoicedateclosed == 1) {
                    document.getElementById("txtbillonedate").classList.add("p-focus");
                    this.errortoast("EXACTでの会計期間がクローズされています。");
                    return;
                }
                if (this.invoiceheaderinfo.billoneinvamt != this.invoiceheaderinfo.entryinvamt) {
                    this.amountdiff = true;
                } else {
                    if (this.selectedaccountlist.length > 0) {
                        this.amountdiff = true;
                        return;
                    }
                    this.saveToBillOneDB('2');
                    //this.amountdiff = true;
                    //const answer = window.confirm('Exactへの請求書登録を行いますか？')
                    //if (!answer) {
                    //    return;
                    //} else {
                    //    this.saveToBillOneDB('2');
                    //    this.amountdiff = true;
                    //}
                }
                this.btnalert = '';
                this.inputchange == false;
            },
            saveToBillOneDB(savestatus) {
                var self = this;
                var params = {
                    "savestatus": savestatus,
                    "username": this.$auth.getCurrentUser().username,
                    "companycode": this.companycode,
                    "invoicetype": this.invoiceheaderinfo.invoicetype,
                    "invoiceheaderinfo": this.invoiceheaderinfo,
                    "invoicelineinfo": this.selected_finalproductlines,
                    "invoicelineiosinfo": this.selected_supplylines,
                    "historylineinfo": this.selected_historylines,
                    "invoicetablesetting": {
                        "selectedheader": JSON.stringify(this.finalproductlineselected)
                    },
                    "searchcontrol": this.searchcontrol,
                    "differenceaccount": this.selectedaccountlist,
                    "newinvoices": this.newinvoices,
                };

                document.getElementById('pagedisable').style.display = "block";
                axios.post('https://billoneexactapi.azurewebsites.net/api/SaveInvoiceInfo'
                    , params).then(
                        function (response) {
                            self.infotoast(response.data.message);
                            //保存前のstatusを取得
                            self.formerstatus = self.invoiceheaderinfo.status;
                            self.invoiceheaderinfo.status = Number(savestatus);
                            //保存flg変更
                            self.saveflag = "1";

                            document.getElementById('pagedisable').style.display = "none";
                            if (response.data.newinvoiceid != self.invoiceid || savestatus == "2") {
                                window.location = self.getNewURL(response.data.newinvoiceid);
                            }
                        }
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            getNewURL(newinvoiceid) {
                var currentUrl = decodeURIComponent(window.location.href);
                var newurl = currentUrl.replaceAll("invoiceid/" + this.invoiceid, "invoiceid/" + newinvoiceid);
                if (this.invoiceheaderinfo.billoneno != "") {
                    newurl = newurl.replaceAll("/billoneno/" + this.billoneno, "/billoneno/" + this.invoiceheaderinfo.billoneno);
                }
                return encodeURI(newurl);
            },
            onToggleFinalproductlines(val) {//「製品」タブ内のテーブルのヘッダーを表示
                this.finalproductlineselected = val;
            },
            onToggleSupplyLines(val) {//「サプライ品」タブ内のテーブルのヘッダーを表示
                this.supplylineselected = val;
            },
            onToggleHistoryLines(val) {//「登録済請求書」タブ内のテーブルのヘッダーを表示
                this.historylineselected = val;
            },
            onFinalProductLineSelect(event) {//「製品」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する関数
                this.recalculateEntryAmount();
            },
            onFinalProductLineRemove(event) {//「製品」タブ内で表示されるテーブルにて、クリック（選択）した行を登録解除する関数
                this.recalculateEntryAmount();
            },
            onSupplyLineSelect(event) {//「サプライ品」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する関数
                this.recalculateEntryAmount();
            },
            onSupplyLineRemove(event) {//「サプライ品」タブ内で表示されるテーブルにて、クリック（選択）した行を登録解除する関数
                this.recalculateEntryAmount();
            },
            onHistoryLineSelect(event) {//「登録済請求書」タブ内で表示されるテーブルにて、クリック（選択）した行を記録する関数
                this.recalculateEntryAmount();
            },
            onHistoryLineRemove(event) {//「登録済請求書」タブ内で表示されるテーブルにて、クリック（選択）した行を登録解除する関数
                this.recalculateEntryAmount();
            },
            showSelectedProducts(selecteddata, columnsdata) {// 「選択中の製品数」ボタンを押下した際の、関数
                console.log(JSON.stringify(selecteddata));
                if (selecteddata.length <= 0) {//選択中の製品がない場合、エラー表示
                    this.errortoast("選択中のアイテムがありません。");
                    return false;
                }
                const CustomDataTable = defineAsyncComponent(() => import('./CustomDataTable'));//PopUpページを設定
                const dialogRef = this.$dialog.open(CustomDataTable, {
                    data: {
                        columns: columnsdata, //「製品」タブ内で表示されるテーブルにて、クリック（選択）した行をPopUpページへ渡す
                        rowdata: selecteddata, //「「製品」タブ内のテーブルのヘッダー設定をPopUpページへ渡す
                        headercolor: this.getProductHeaderStyle(), //テーブルのヘッダー色
                        datecolumns: this.datecolumns,
                        currencycolumns: this.currencycolumns
                    },
                    props: {
                        header: '選択中のアイテム数 : ' + selecteddata.length,//PopUpページのタイトル
                        style: {
                            width: '98vw',
                        },
                        breakpoints: {
                            '960px': '75vw',
                            '640px': '90vw'
                        },
                        modal: true
                    }
                });
            },
            fncClickOnBody() {
                var focusElements = document.getElementsByClassName("p-focus");
                for (var i = 0; i < focusElements.length; i++) {
                    focusElements[i].classList.remove("p-focus");
                }
            },
            setSelectedTab(event) {
                document.getElementById('pagedisable').style.display = "block";
                if (event.index == 0 && this.finalproductinfo.length <= 0) {//製品タブ
                    if (this.invoiceheaderinfo.status != "2") this.getReceiptItemInfo();//検索対象期間内の全受領済アイテムを抽出
                    this.getFinalProductSelectedLine();//前回の選択したアイテムリストを取得
                }
                else if (event.index == 1 && this.supplyinfo.length <= 0) {//サプライ品タブ
                    if (this.invoiceheaderinfo.status != "2") this.getSupplyItemInfo();//サプライ品リスト抽出
                    this.getSupplySelectedLine();//前回の選択したアイテムリストを取得
                }
                else if (event.index == 2) {//登録済請求書タブ
                    this.getPurchaseInvoiceHistoryByCreditor();//登録済請求書リスト抽出
                    // this.getInvoiceHistorySelectedLine();//前回の選択したアイテムリストを取得
                }
                document.getElementById('pagedisable').style.display = "none";
            },
            getCostCenterList() { //消費税リストを取得し、選択ボックスで表示
                var params = {
                    "companycode": this.companycode
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/CostCenterList'
                    , params).then(
                        response => (
                            this.costcenterlist = JSON.parse(response.data), this.filteredcostcenterlist = this.costcenterlist
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            showTaxList(event, data, field) {
                event.preventDefault();
                this.$refs.optaxdisplay.toggle(event);
                this.selectedDropDown = data;
                this.selectedField = field;
                this.selectedEvent = event;
            },
            showSupplyTaxList(event, data, field) {
                event.preventDefault();
                this.$refs.splytaxdisplay.toggle(event);
                this.selectedDropDown = data;
                this.selectedField = field;
                this.selectedEvent = event;
            },
            selectTax(tax) {
                this.selectedDropDown[this.selectedField] = tax;
                this.$refs.optaxdisplay.hide();
                this.changeTaxCode(this.selectedEvent, this.selectedDropDown, '税コードを選択してください。');
                this.recalculateEntryAmount();
                this.wholeloading = false;
            },
            selectSupplyTax(tax) {
                this.selectedDropDown[this.selectedField] = tax;
                this.$refs.splytaxdisplay.hide();
                this.changeSupplyTaxCode(this.selectedEvent, this.selectedDropDown, '税コードを選択してください。');
                this.recalculateEntryAmount();
                this.wholeloading = false;
            },
            showCostCenterList(event, obj, field) {
                event.preventDefault();
                this.$refs.opcostcenterdisplay.toggle(event);
                this.selectedDropDown = obj;
                this.selectedField = field;
            },
            selectCostCenter(costcenter) {
                this.selectedDropDown[this.selectedField] = costcenter;
                this.$refs.opcostcenterdisplay.hide();
                this.wholeloading = false;
            },
            costcentkeywordsearch(event) {
                var self = this;
                this.loadkeywordcostcenter = true;
                this.filteredcostcenterlist = this.costcenterlist.filter((data) => JSON.stringify(data).toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1);
                setTimeout(function () {
                    self.loadkeywordcostcenter = false;
                }, 500);
            },
            changeItemAmount(event, data, fieldname, errormessage, index) {
                var caltax = null;
                if (event.value == "") {
                    this.errortoast(errormessage);
                    event.originalEvent.target.focus();
                    event.originalEvent.target.style = 'z-index:2000';
                    this.wholeloading = true;
                    return;
                } else {
                    event.originalEvent.target.style = 'z-index:0';
                    data.outstanding = parseInt(event.value.replaceAll("￥", "").replaceAll("¥", "").replaceAll(",", ""));
                    if (typeof data.vatcode === 'string') {
                        caltax = CommonSetting.taxComputing(data.outstanding, data.vatcode.trim());//前後の空欄を消す
                    } else {
                        caltax = CommonSetting.taxComputing(data.outstanding, data.vatcode.btwtrans);
                    }
                    data.outstamtinclvat = caltax.finalprice;
                    data.vat = caltax.tax;//なしの場合はvat
                    data.amtorderedvat = caltax.tax;//アイテムの場合はamtorderedvat
                    this.wholeloading = false;
                }
                this.blurRowSelect(data, "製品");
            },
            //サプライ品の計算
            changeItemAmountSupply(event, data, fieldname, errormessage) {
                var caltax = null;
                if (event.value == "") {
                    this.errortoast(errormessage);
                    event.originalEvent.target.focus();
                    event.originalEvent.target.style = 'z-index:2000';
                    this.wholeloading = true;
                    return;
                } else {
                    event.originalEvent.target.style = 'z-index:0';
                    data.sk2 = parseInt(event.value.replaceAll("￥", "").replaceAll("¥", "").replaceAll(",", ""));
                    if (typeof data.exvat === 'string') {
                        caltax = CommonSetting.taxComputing(data.sk2, data.exvat.trim());//前後の空欄を消す
                    } else {
                        caltax = CommonSetting.taxComputing(data.sk2, data.exvat.btwtrans);
                    }
                    data.examtinclvat = caltax.finalprice;
                    data.exvatamt = caltax.tax;
                    this.wholeloading = false;
                }
                this.blurRowSelect(data, "サプライ");
            },
            //blur後、行は自動的に選択される
            blurRowSelect(data, tabname) {
                if (tabname === "製品") {
                    if (this.selected_finalproductlines.every(item => item !== data)) {
                        this.selected_finalproductlines.push(data);
                    }
                }
                else {
                    if (this.selected_supplylines.every(item => item !== data)) {
                        this.selected_supplylines.push(data);
                    }
                }
                this.recalculateEntryAmount();
            },
            changeTaxCode(event, data, errormessage) {
                var caltax = null;
                if (event.target._value == "") {
                    this.errortoast(errormessage);
                    event.target.focus();
                    event.target.style = 'z-index:2000';
                    this.wholeloading = true;
                    return;
                } else {
                    event.target.style = 'z-index:0';
                    var taxcode = "";
                    if (typeof data.vatcode === 'string') {
                        taxcode = data.vatcode.trim();
                    } else {
                        taxcode = data.vatcode.btwtrans.trim();
                    }
                    caltax = CommonSetting.taxComputing(data.outstanding, taxcode.toUpperCase());
                    if (isNaN(caltax.finalprice)) {
                        this.errortoast("税コードが不正です。");
                        event.target.focus();
                        return;
                    }
                    data.outstamtinclvat = caltax.finalprice;
                    data.vat = caltax.tax;//なしの場合は税額はvat
                    data.amtorderedvat = caltax.tax;//アイテムの場合は税額はamtorderedvat
                    this.blurRowSelect(data, "製品");
                    this.wholeloading = false;
                }
            },
            changeSupplyTaxCode(event, data, errormessage) {
                var caltax = null;
                if (event.target._value == "") {
                    this.errortoast(errormessage);
                    event.target.focus();
                    event.target.style = 'z-index:2000';
                    this.wholeloading = true;
                    return;
                } else {
                    event.target.style = 'z-index:0';
                    var taxcode = "";
                    if (typeof data.exvat === 'string') {
                        taxcode = data.exvat.trim();
                    } else {
                        taxcode = data.exvat.btwtrans.trim();
                    }
                    caltax = CommonSetting.taxComputing(data.sk2, taxcode.toUpperCase());
                    if (isNaN(caltax.finalprice)) {
                        this.errortoast("税コードが不正です。");
                        event.target.focus();
                        return;
                    }
                    data.examtinclvat = caltax.finalprice;
                    data.exvatamt = caltax.tax;
                    this.blurRowSelect(data, "サプライ");
                    this.wholeloading = false;
                }
            },

            changeCostCenter(event, data, errormessage) {
                var caltax = null;
                if (event.target._value == "") {
                    this.errortoast(errormessage);
                    event.target.focus();
                    event.target.style = 'z-index:2000';
                    this.wholeloading = true;
                    return;
                } else {
                    event.target.style = 'z-index:0';
                    var chkcostcenter = this.costcenterlist.filter((data) => data.kstplcode.trim().toLowerCase() == event.target._value.trim().toLowerCase());
                    if (chkcostcenter.length <= 0) {
                        this.errortoast("コストセンターが不正です。");
                        event.target.focus();
                        return;
                    }
                    this.blurRowSelect(data, "製品");
                    this.wholeloading = false;
                }
            },
            recalculateEntryAmount() {
                this.invoiceheaderinfo.entryinvamt = 0;
                for (var iprod = 0; iprod < this.selected_finalproductlines.length; iprod++) {
                    this.invoiceheaderinfo.entryinvamt += this.selected_finalproductlines[iprod].outstamtinclvat;
                }
                for (var ios = 0; ios < this.selected_supplylines.length; ios++) {
                    this.invoiceheaderinfo.entryinvamt += this.selected_supplylines[ios].examtinclvat;
                }
                for (var ihs = 0; ihs < this.selected_historylines.length; ihs++) {
                    if (this.selected_historylines[ihs] == undefined) return;
                    this.invoiceheaderinfo.entryinvamt += this.selected_historylines[ihs].bedrag;
                }
                for (var iac = 0; iac < this.selectedaccountlist.length; iac++) {
                    this.invoiceheaderinfo.entryinvamt += this.selectedaccountlist[iac].amount;
                }

            },
            RemoveItem(type, data) {
                if (type == '製品') {
                    this.selected_finalproductlines = this.selected_finalproductlines.filter(item => JSON.stringify(item) !== JSON.stringify(data));
                }
                else if (type == 'サプライ') {
                    this.selected_supplylines = this.selected_supplylines.filter(item => JSON.stringify(item) !== JSON.stringify(data));
                }
            },
            getAmountDiffClass() {
                if ((this.invoiceheaderinfo.billoneinvamt - this.invoiceheaderinfo.entryinvamt) != 0) {
                    return "errortext";
                }
                return "";
            },
            saveRepairedInvoice() {
                var ierrcnt = 0;
                if (this.invoiceheaderinfo.billoneinvamt - this.invoiceheaderinfo.entryinvamt != 0) {
                    this.amountdiff = true;
                    alert("差額が 「0 」になるまで相殺してください。");
                    return false;
                }
                for (var iac = 0; iac < this.selectedaccountlist.length; iac++) {
                    if (this.selectedaccountlist[iac].remark == "") {
                        this.selectedaccountlist[iac].errormsg = "説明を「備考」に入力してください。";
                        ierrcnt++;
                    } else {
                        this.selectedaccountlist[iac].errormsg = "";
                    }
                    if (this.selectedaccountlist[iac].amount == null) {
                        this.selectedaccountlist[iac].amount = 0;
                    }

                    if (this.selectedaccountlist[iac].employee == "" || this.selectedaccountlist[iac].employee == null) {
                        this.selectedaccountlist[iac].epyerrormsg = "社員を選択してください。";
                        ierrcnt++;
                    } else {
                        this.selectedaccountlist[iac].epyerrormsg = "";
                    }

                    if (this.selectedaccountlist[iac].costcenter == "" || this.selectedaccountlist[iac].costcenter == null) {
                        this.selectedaccountlist[iac].ccerrormsg = "コストセンターを選択してください。";
                        ierrcnt++;
                    } else {
                        this.selectedaccountlist[iac].ccerrormsg = "";
                    }

                }
                if (ierrcnt > 0) return;
                const answer = window.confirm('Exactへの請求書登録を行いますか？')
                if (!answer) {
                    return
                } else {
                    this.saveToBillOneDB('2');
                }
                this.amountdiff = false;
            },
            repairAmountChange(event, account) {
                account.amount = event.value;
                this.recalculateEntryAmount();
            },
            //入力金額全角⇒半角の対応
            HalfChange(event, account) {
                const toHalfWidth = (str) => {
                    return str.replace(/[！-～]/g, (char) => {
                        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
                    }).replace(/　/g, ' ').replace(/．/g, '.').replace(/，/g, ',');
                };
                const inputValue = event.target.value;
                const halfWidthValue = toHalfWidth(inputValue);
                account.amount = parseFloat(halfWidthValue) || 0;
                this.recalculateEntryAmount();
            },
            getInvoiceCorrectionLineInfo() {
                var params = {
                    "companycode": this.companycode,
                    "invoiceid": this.invoiceheaderinfo.invoiceid
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/GetInvoiceCorrectionLineInfo'
                    , params).then(
                        response => (
                            this.correctionlines = JSON.parse(response.data), this.correctionamt = this.correctionlines.reduce((accumulator, object) => { return accumulator + object.amount; }, 0)
                        )
                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });
            },
            showCorrectionLineInfo(event) {
                this.$refs.opcorline.toggle(event);
            },
            handleKeyDown(event) {
                // Check if the Ctrl key is pressed and the "a" key is pressed
                if (event.ctrlKey && event.key === 'a') {
                    event.preventDefault(); // Prevent the default behavior (text selection)
                    this.recalculateEntryAmount();//金額再計算
                }
            },
            checkValidInvoiceDate(event) {
                var self = this;
                if (event == 'txtinvdate') { this.invoiceheaderinfo.billoneinvdate = dayjs(this.invoiceheaderinfo.billoneinvdate).format('YYYY-MM-DD'); }
                var params = {
                    "companycode": this.companycode,
                    "billoneinvdate": this.invoiceheaderinfo.billoneinvdate,
                    "glno": this.invoiceheaderinfo.glno
                };
                axios.post('https://billoneexactapi.azurewebsites.net/api/CheckInvoiceClosedPeriod'
                    , params).then(
                        function (response) {
                            self.invoicedateclosed = JSON.parse(response.data)[0].closed;
                        }

                    ).catch(error => {
                        if (JSON.stringify(error).indexOf("401") >= 0) {
                            window.location.reload();
                        }
                    });

            },
            getInvoiceDateClass() {
                if (this.invoicedateclosed == 1) {
                    return "p-invalid";
                }
                return "";
            }
        }

    };

</script>

<style scoped>
    .whiteback {
        background: white;
        outline: 5px solid #00A1E0;
    }

    .lightblueback {
        background: #C2EFFF;
        outline: 5px solid #00A1E0;
    }

    .pinkback {
        background: rgba(232, 224, 255, 0.98);
        outline: 5px solid #00A1E0;
    }

    .p-column-filter {
        width: 100%;
        box-sizing: border-box;
    }

    div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        background-color: yellow;
        padding: 0px;
        font-size: 20px;
        z-index: 100;
        width: 100%;
    }

    .errortext {
        color: red;
        font-weight: 500;
    }

    .p-invalid > :not(marquee) {
        color: red;
    }
</style>