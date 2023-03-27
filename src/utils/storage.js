// 封装本地存储操作模块

// 1 储存数据
export const setItem = (key, value) => {
  // 将数组对象类型的数据转换为JSON格式字符串进行储存
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 2 获取数据
export const getItem = (key) => {
  const data = localStorage.getItem(key)
  // 验证data是否为JSON字符串十分麻烦，采用如下方法
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 3 删除数据
export const removeItem = (key) => {
  localStorage.removeItem(key)
}
