import React from "react";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($permalink: String!) {
    markdownRemark(frontmatter: { permalink: { eq: $permalink } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
