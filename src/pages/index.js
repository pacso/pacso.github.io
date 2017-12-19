import React from "react";
import Link from "gatsby-link";

export default ({ data }) => {
  return (
    <div>
      <h1>Posts</h1>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h3>
            <Link to={node.frontmatter.permalink}>
              {node.frontmatter.title}{" "}
              <span>- {node.frontmatter.date}</span>
            </Link>
          </h3>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  )
};

export const query = graphql`
  query BlogPostsQuery {
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            permalink
          }
          excerpt
        }
      }
    }
  }
`
