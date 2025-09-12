// Input: flat array of comments (lean objects) with ._id and .parentId
module.exports = function buildTree(comments) {
const map = {};
const roots = [];


// initialize map
comments.forEach(c => {
const id = String(c._id);
map[id] = { ...c, children: [] };
});


// link children
comments.forEach(c => {
const id = String(c._id);
if (c.parentId) {
const pid = String(c.parentId);
if (map[pid]) {
map[pid].children.push(map[id]);
} else {
// orphaned reply (parent deleted?) — treat as root
roots.push(map[id]);
}
} else {
roots.push(map[id]);
}
});


return roots;
};