<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="searchKey" placeholder="请输入会员昵称" @change="filterData" clearable />
        </div>
        <div>
          <el-input v-model="searchPhone" placeholder="会员手机号筛选" @change="filterData" clearable />
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>
      <el-table :data="memberList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline :class="$style['demo-table-expand']">
              <el-form-item label="注册时间：">
                <span>时间时间时间时间时间时间时间时间时时间时时间时时间时时间时间时间时间时间</span>
              </el-form-item>
              <el-form-item label="注册时间：">
                <span>{{ props.row.regDate }}</span>
              </el-form-item>
              <el-form-item label="注册时间：">
                <span>{{ props.row.regDate }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" label="会员信息">
          <template slot-scope="{row}">
            <MemberInfo :avatar="row.photoUrl" :name="row.name" :phone="row.mobile"></MemberInfo>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" align="center">
          <template slot-scope="{row}">{{row.levelStr?row.levelStr:"暂无"}}</template>
        </el-table-column>
        <el-table-column label="推荐码" align="center" prop="promotionCode">
        </el-table-column>
        <el-table-column label="推荐人数" align="center" prop="childCount">
        </el-table-column>
        <el-table-column label="团队人数" align="center" prop="groupCount">
        </el-table-column>
        <el-table-column label="奖金余额" align="center" prop="bnous">
        </el-table-column>
        <el-table-column label="团队业绩" align="center" prop="groupMoney">
        </el-table-column>
        <el-table-column label="会员状态" align="center">
          <template slot-scope="{row}">{{row.isLockedStr}}</template>
        </el-table-column>
        <!-- <el-table-column label="注册时间" align="center" min-width="100px" prop="regDate">
        </el-table-column> -->

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
        </el-table-column>
      </el-table>
      <Pay :form="item" v-if="showPay" @close="showPay = false"></Pay>
      <Bill :form="item" v-if="showBill" @close="showBill = false"></Bill>
      <ResetPwd :item="item" v-if="showResetPwd" @close="showResetPwd = false"></ResetPwd>
      <BasePagination :max="totalPage" :totalCount="totalCount" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>
<script>
import MemberInfo from '@/components/MemberInfo'
import Pay from './MemberPay'
import Bill from './MemberBill'
import ResetPwd from './MemberResetPwd'
import BasePagination from '@/components/BasePagination'
export default {
  components: {
    MemberInfo,
    ResetPwd,
    Bill,
    Pay,
    BasePagination
  },
  created() {
    this.getData()
  },
  data() {
    return {
      searchPhone: '',
      showPay: false,
      showBill: false,
      showResetPwd: false,
      item: {},
      memberList: [],
      totalPage: 1,
      nowPage: 1,
      pageSize: 10,
      totalCount: 1,
      searchKey: ''
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
        .get('/api/Member/List', {
          params: {
            page: this.nowPage,
            pageSize: this.pageSize,
            searchKey: this.searchKey,
            mobile: this.searchPhone
          }
        })
        .then(res => {
          this.memberList = res.value.data
          this.totalPage = res.value.totalPage
          this.totalCount = res.value.totalCount
        })
    },
    resetPwd(row) {
      this.item = row
      this.showResetPwd = true
    },
    bill(row) {
      this.item = row
      this.showBill = true
    },
    pay(row) {
      this.item = row
      this.showPay = true
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    levealUpdate(row) {
      this.$confirm('确认升级该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/Member/MemberUpgrade', {
              MemberId: row.id
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '升级成功！',
                  type: 'success'
                })
                this.getData()
              }
            })
        })
        .catch(() => {
          this.$message('已取消升级！')
        })
    },
    changeStatus(row) {
      if (row.isLocked) {
        this.$confirm('确定解锁该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http
              .post('/api/Member/UnLocked', {
                userId: row.id
              })
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '解锁成功!'
                  })
                  this.getData()
                }
              })
          })
          .catch(() => {
            this.$message('已取消解锁该用户！')
          })
      } else {
        this.$confirm('确定锁定该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http
              .post('/api/Member/Locked', {
                userId: row.id
              })
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '锁定用户成功!'
                  })
                  this.getData()
                }
              })
          })
          .catch(() => {
            this.$message('已取消锁定该用户！')
          })
      }
    }
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
.demo-table-expand {
  width: 50%;
  > * {
    width: 100%;
    margin-bottom: 0px;
    label {
      width: 90px;
      color: #99a9bf;
    }
  }
}
</style>
