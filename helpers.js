export const createTreeNode = function (data, parent = {}) {
  const children = []

  this.data = data
  this.parent = parent

  this.addChild = function (child) {
    this.children.push(child)
  }

  this.getChildren = function () {
    return children
  }
}
