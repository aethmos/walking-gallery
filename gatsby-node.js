/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreateNode = ({node, actions, getNode}) => {
    // if (node.internal.mediaType === 'image/jpeg')
    console.log(node);
};

exports.createPages = async ({graphql, actions, reporter}) => {
    const {createPage} = actions;
    const data = await graphql(`
    query {
      categories: allCategoryJson {
          nodes {
            id
            relativeDirectory
          }
      }
    }
  `);
    if (data.errors) {
        reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
    }
    const categories = data.categories.nodes;
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
