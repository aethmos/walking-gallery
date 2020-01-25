/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require("path");

exports.onCreateNode = ({node, actions, getNode}) => {
    // console.log(node);
};

exports.createPages = async ({graphql, actions, reporter}) => {
    const {createPage} = actions;
    const result = await graphql(`
    query {
      categories: allCategoryJson {
          nodes {
            id
            relativeDirectory
          }
      }
    }
  `);
    if (result.errors) {
        reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
    }
    const categories = result.data.categories.nodes;
    categories.map((value, index) => {
        createPage({
            path: value.relativeDirectory,
            component: path.resolve(`./src/components/AlbumTemplate.js`),
            context: {
                categoryId: value.id,
                path: value.relativeDirectory,

            },
        })
    });
};
