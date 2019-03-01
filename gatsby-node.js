// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*'

    // Update the page.
    createPage(page)
  }
}
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /firebase/,
            use: ['null-loader'],
          },
        ],
      },
    })
  }
}
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty',
    },
  })
}
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
