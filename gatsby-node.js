/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateNode = ({ node, actions, getNode }) => {
    // if (node.internal.mediaType === 'image/jpeg')
    console.log(node);

    if (node.internal.type === 'CategoryJson') {
        let { createPage } = actions;

    }
};
