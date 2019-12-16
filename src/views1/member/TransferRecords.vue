<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="searchPhone" placeholder="通过手机号筛选" @change="filterData" clearable />
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>
      <el-table :data="memberList">
        <el-table-column align="center" width="250" label="转出方信息">
          <template slot-scope="{row}">
            <MemberInfo :avatar="row.fromMemberThumb" :name="row.fromMemberName" :phone="row.fromMemberMobile"></MemberInfo>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="转入方信息">
          <template slot-scope="{row}">
            <MemberInfo :avatar="row.toMemberThumb" :name="row.toMemberName" :phone="row.toMemberMobile"></MemberInfo>
          </template>
        </el-table-column>
        <!-- <el-table-column label="会员昵称"
          align="center">
          <template slot-scope="{row}">{{row.name}}</template>
        </el-table-column>
        <el-table-column label="账号(手机号)"
          align="center">
          <template slot-scope="{row}">{{row.mobile}}</template>
        </el-table-column> -->
        <!-- <el-table-column label="转出方" align="center">
          <template slot-scope="{row}">{{row.fromMemberName}}</template>
        </el-table-column>
        <el-table-column label="转入方" align="center">
          <template slot-scope="{row}">{{row.toMemberName}}</template>
        </el-table-column> -->
        <el-table-column label="转出金额" align="center">
          <template slot-scope="{row}">{{row.moeny}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">{{row.createDate}}</template>
        </el-table-column>
        <!-- <el-table-column label="奖金账户余额" align="center">
          <template slot-scope="{row}">{{row.bnous}}</template>
        </el-table-column>
        <el-table-column label="累计奖金总额" align="center">
          <template slot-scope="{row}">{{row.totalBnous}}</template>
        </el-table-column>
        <el-table-column label="团队业绩" align="center">
          <template slot-scope="{row}">{{row.groupMoney}}</template>
        </el-table-column>
        <el-table-column label="会员状态" align="center">
          <template slot-scope="{row}">{{row.isLockedStr}}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" min-width="100px">
          <template slot-scope="{row}">{{row.regDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="400px" align="center">
          <template slot-scope="{row}">
            <el-button @click="resetPwd(row)" size="mini" type="warning">
              重置密码
            </el-button>
            <el-button @click="bill(row)" size="mini" type="primary">
              账单
            </el-button>
            <el-button v-if="!row.isLocked" @click="pay(row)" size="mini" type="success">
              充值
            </el-button>
            <el-button v-if="!row.isLocked" @click="levealUpdate(row)" size="mini" type="primary">
              升级
            </el-button>
            <el-button @click="changeStatus(row)" size="mini" :type="row.isLocked?'warning':'danger'" :title="row.isLocked?'点击解锁该用户':'点击锁定该用户'">
              {{row.isLocked?"解锁":"锁定"}}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <Pay :form="item" v-if="showPay" @close="showPay = false"></Pay>
      <Bill :form="item" v-if="showBill" @close="showBill = false"></Bill>
      <ResetPwd :item="item" v-if="showResetPwd" @close="showResetPwd = false"></ResetPwd> -->
      <BasePagination :max="totalPage" :totalCount="totalCount" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>
<script>
import MemberInfo from '@/components/MemberInfo'
// import Pay from './components/memberList/Pay'
// import Bill from './components/memberList/Bill'
// import ResetPwd from './components/memberList/ResetPwd'
import BasePagination from '@/components/BasePagination'
export default {
  components: {
    MemberInfo,
    BasePagination
  },
  created() {
    this.getData()
  },
  data() {
    return {
      searchPhone: '',
      item: {},
      memberList: [],
      totalPage: 1,
      nowPage: 1,
      pageSize: 10,
      totalCount: 1,
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http
        .get('api/MemberCharge/TransferListSystem', {
          params: {
            page: this.nowPage,
            pageSize: this.pageSize,
            mobile: this.searchPhone
          }
        })
        .then(res => {
          console.log('res结果：',res)
          this.memberList = res.value.data
          this.totalPage = res.value.totalPage
          this.totalCount = res.value.totalCount
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
  }
}
</script>


<style lang="scss" module >
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
el-table-column {
  height: 50px;
}
</style>
