import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import styled from "@emotion/styled"

const Container = styled.div`
  text-align: center;
`

const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  height: 78vh;
`

const SubTitle = styled.p`
  padding: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`

const NameHeader = styled.h2`
  font-size: 3rem;
  margin-bottom: 0;
`

const Description = styled.p`
  padding: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`

const LandingBio = () => (
  <StaticQuery
    query={graphql`
      query LandingSiteTitleQuery {
        site {
          siteMetadata {
            title
            subtitle
            description
          }
        }
      }
    `}
    render={(data) => (
      <OuterContainer>
        <Container>
          <NameHeader>{data.site.siteMetadata.title}</NameHeader>
          <SubTitle>{data.site.siteMetadata.subtitle}</SubTitle>
          <Description>{data.site.siteMetadata.description}</Description>
        </Container>
      </OuterContainer>
    )}
  />
)

NameHeader.propTypes = {
  siteTitle: PropTypes.string,
  subtitle: PropTypes.string,
}

NameHeader.defaultProps = {
  siteTitle: ``,
  subtitle: ``,
}

export default LandingBio
