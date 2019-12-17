<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="id" placeholder="订单号筛选" @change="filterData" clearable />
        </div>
        <div>
          <el-input v-model="searchPhone" placeholder="会员手机号筛选" @change="filterData" clearable />
        </div>
        <div>
          <el-input v-model="searchKey" placeholder="商品名称筛选" @change="filterData" clearable />
        </div>
        <div>
          <el-select placeholder="订单状态筛选" v-model="orderState" @change="filterData" clearable>
            <el-option v-for="item in orderStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>

      <el-table :data="orderData" @expand-change="testExpand" ref="orderData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline :class="$style['demo-table-expand']">
              <el-form-item label="联系人：">
                <span>{{ props.row.contact }}</span>
              </el-form-item>
              <el-form-item label="联系电话：">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="收货地址：">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="物流公司：">
                <span>{{ props.row.expressCompany }}</span>
              </el-form-item>
              <el-form-item label="物流单号：">
                <span>{{ props.row.expressNumber }}</span>
              </el-form-item>
              <el-form-item label="订单类型：">
                <span>{{ props.row.typeStr }}</span>
              </el-form-item>
              <el-form-item label="赠送芝麻：">
                <span>{{ props.row.giftSesame }}</span>
              </el-form-item>
              <el-form-item label="赠送优惠券：">
                <span>{{ props.row.giftCoupon }}</span>
              </el-form-item>
              <el-form-item label="期数：">
                <span>{{ props.row.periodName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" label="会员信息">
          <template slot-scope="{row}">
            <MemberInfo :avatar="row.memberPhoto" :name="row.memberName" :phone="row.memberPhone"></MemberInfo>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" min-width="120">
          <template slot-scope="{row}">{{row.id}}</template>
        </el-table-column>

        <el-table-column label="商品名称" align="center">
          <template slot-scope="{row}">{{row.goodsName}}</template>
        </el-table-column>

        <el-table-column label="数量" align="center">
          <template slot-scope="{row}">{{row.goodsCount}}</template>
        </el-table-column>

        <el-table-column label="价格" align="center">
          <template slot-scope="{row}">{{row.price}}</template>
        </el-table-column>
        <el-table-column label="会员电话" align="center">
          <template slot-scope="{row}">{{row.memberPhone}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="100">
          <template slot-scope="{row}">{{row.createDate}}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="{row}">{{row.statusStr}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="{row}">
            <el-button @click="detailInfo(row)" size="mini" type="primary">
              详情
            </el-button>
            <el-button v-if="row.status === 10" @click="ship(row)" size="mini" type="success">
              发货
            </el-button>
            <!-- <el-button v-if="row.status > 10"
              @click="wuliu(row)"
              size="mini"
              type="success">
              查看物流
            </el-button> -->

          </template>
        </el-table-column>
      </el-table>

      <!-- <OrderDetails v-if="showDetails"
        :propitem="item"
        @close="closeDia"></OrderDetails> -->
      <!-- <DeliverGoods v-if="showFahuo"
        :goods="item"
        @close="closeDia"></DeliverGoods> -->
      <!-- <Wuliu v-if="showWuliu"
        :propitem="item"
        @close="closeDia"></Wuliu> -->
      <BasePagination :max="maxPage" :totalCount="totalCount" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>
<script>
import MemberInfo from '@/components/MemberInfo'
// import OrderDetails from './MemberPayoutOrderDetail'
import BasePagination from '@/components/BasePagination'
export default {
  components: {
    MemberInfo,
    BasePagination
  },
  data() {
    return {
      id: '',
      searchPhone: '',
      searchKey: '',
      memberName: '',
      orderState: '',
      dates: [],
      showDetails: false,
      showFahuo: false,
      showWuliu: false,
      item: {},
      orderData: [],
      orderStatus: [],
      maxPage: 1,
      nowPage: 1,
      pageSize: 10,
      totalCount: 1
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    testExpand(row) {
      console.log(row)
    },
    getData() {
      this.orderData = []
      this.$http
        .get('/api/RetailOrder/RetailOrderList', {
          params: {
            page: this.nowPage,
            pageSize: this.pageSize,
            orderId: this.id,
            searchKey: this.searchKey,
            orderStatus: this.orderState,
            mobile: this.searchPhone
          }
        })
        .then(res => {
          this.orderData = res.value.data
          this.orderStatus = res.orderStatus
          this.maxPage = res.value.totalPage
          this.totalCount = res.value.totalCount
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    ship(data) {
      this.item = data
      this.showFahuo = true
    },
    // wuliu(row) {
    //   this.item = row
    //   this.showWuliu = true
    // },
    detailInfo(row) {
      // this.item = row
      // this.showDetails = true
      this.$refs.orderData.toggleRowExpansion(row)
    },
    closeDia(value) {
      this.showFahuo = false
      this.showWuliu = false
      this.showDetails = false
      if (value) this.getData()
    }
  }
}
</script>


<style lang="scss" module>
.header {
  display: flex;
  align-items: center;

  > div {
    flex-grow: 0;
    flex-shrink: 0;

    &:not(:last-child) {
      margin-right: 20px;
    }

    > span {
      margin-right: 5px;
    }
  }

  .search {
    display: flex;
    align-items: center;

    > div {
      width: 200px;
    }
  }

  [space] {
    flex-grow: 1;
  }
}

.demo-table-expand {
  width: 50%;
  > * {
    width: 100%;
    margin-bottom: 0px;
    label {
      width: 100px;
      color: #99a9bf;
    }
  }
}
</style>
<style lang="scss" scoped>
.inp {
  margin-right: 10px;
  /* margin-top: -10px */
}
</style>

