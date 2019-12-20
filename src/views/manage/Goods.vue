<template>
  <el-card>
    <div slot="header" :class="$style.header">
      <div :class="$style.search">
        <span>搜索：</span>
        <el-input v-model="keywords" placeholder="输入商品名称" @change="filterData" clearable />
      </div>
      <el-button @click="filterData" type="primary">
        搜索
        <i class="el-icon-search"></i>
      </el-button>
      <el-button @click="goodsAdd" class="add" type="primary">
        添加商品
      </el-button>
    </div>

    <el-table :data="goodsData">

      <el-table-column label="商品图片" align="center" class="imgbox">
        <template slot-scope="{row}">
          <img :src="row.thumb" class="img">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="120" align="center" prop="name">
      </el-table-column>
      <el-table-column label="零售价" align="center" prop="retailPrice">
      </el-table-column>
      <el-table-column label="商品ID" align="center" prop="id">
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="{row}">
          <el-button @click="goodsEdit(row)" size="mini" type="primary">
            编辑
          </el-button>
          <el-button @click="del(row)" size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出对话框 -->
    <!-- <tianjia v-if="isAddShow" @close="closeDia"></tianjia> -->
    <GoodsEdit v-if="isEditShow" @close="closeDia" :item="item"></GoodsEdit>
    <BasePagination :max="totalPage" :now.sync="nowPage" :totalCount="totalCount"></BasePagination>
  </el-card>
</template>
<script>
// import tianjia from './GoodsAdd'
import GoodsEdit from './GoodsEdit'
import BasePagination from '@/components/BasePagination'

export default {
  components: {
    // tianjia,
    GoodsEdit,
    BasePagination
  },
  data() {
    return {
      isEditShow: false,
      keywords: '',
      goodsData: [],
      totalPage: 1,
      nowPage: 1,
      pageSize: 10,
      totalCount: 0,
      item: {}
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
    getData() {
      this.$http
        .get('/api/Goods/GoodsList', {
          params: {
            page: this.nowPage,
            pageSize: 10,
            SearchKey: this.keywords
          }
        })
        .then(res => {
          this.goodsData = res.value.data
          this.totalPage = res.value.totalPage
          this.totalCount = res.value.totalCount
          console.log('googsData', res.value.data)
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    //添加商品
    goodsAdd() {
      this.item = {}
      this.isEditShow = true
    },
    goodsEdit(data) {
      this.item = data
      this.isEditShow = true
    },
    closeDia(value) {
      this.isEditShow = false
      if (value) this.getData()
    },
    del(item) {
      this.$confirm('确定删除商品 ' + item.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/Goods/Delete', {
              goodsId: item.id
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
</style>
<style lang="scss" scoped>
.inp {
  width: 80%;
}
.sliderbox {
  display: flex;
}
.slider {
  flex: 1;
}
.avatar {
  width: 100px;
  height: 250px;
  border: 1px solid black;
}
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
.img {
  width: 80px;
}
.all-in-one {
  font-size: 12px;
  line-height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
</style>

