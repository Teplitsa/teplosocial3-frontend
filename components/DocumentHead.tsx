import Head from "next/head";
import { ReactElement } from "react";
import { useStoreState } from "../model/helpers/hooks";
import * as utils from "../utilities/utilities";
import Favicon from "../assets/img/favicon-white.svg";

const DocumentHead: React.FunctionComponent = (): ReactElement => {
  const {
    yoast_head_json,
    title: pageTitle,
    content,
  } = useStoreState((state) => state.page);

  if (!yoast_head_json) {
    return (
      <Head>
        {pageTitle && (
          <title>
            {utils.decodeHtmlSpecialChars(pageTitle?.rendered?.trim().length > 0
              ? `${pageTitle.rendered} — `
              : "") + "Теплица.Курсы"}
          </title>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        {content?.rendered?.trim().length > 0 && (
          <meta
            name="description"
            content={utils.decodeHtmlEntities(content.rendered)}
          />
        )}
        {Favicon && (
          <link rel="icon" href={Favicon} sizes="any" type="image/svg+xml" />
        )}
      </Head>
    );
  }

  const {
    title,
    description,
    robots,
    canonical,
    og_type,
    og_title,
    og_description,
    og_url,
    og_site_name,
    article_author,
    article_published_time,
    article_modified_time,
    og_image,
    twitter_card,
    twitter_title,
    twitter_description,
    twitter_image,
  } = yoast_head_json;

  return (
    <Head>
      <title>{utils.decodeHtmlSpecialChars(title)}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      {/* {focuskw && <meta name="keywords" content={focuskw} />} */}
      {description && <meta name="description" content={description} />}
      {(robots && (robots.index || robots.follow)) && (
        <meta name="robots" content={[robots.index, robots.follow].join(",")} />
      )}
      {og_type && <meta property="og:type" content={og_type} />}
      {article_author && (
        <meta property="article:author" content={article_author} />
      )}
      {article_published_time && (
        <meta
          property="article:published_time"
          content={article_published_time}
        />
      )}
      {article_modified_time && (
        <meta
          property="article:published_time"
          content={article_modified_time}
        />
      )}
      {og_title && <meta property="og:title" content={og_title} />}
      {og_url && <meta property="og:url" content={og_url} />}
      {og_site_name && <meta property="og:site_name" content={og_site_name} />}
      {og_description && (
        <meta property="og:description" content={og_description} />
      )}
      {og_image?.length > 0 && og_image[0].url && (
        <meta property="og:image" content={og_image[0].url} />
      )}
      {og_image?.length > 0 && og_image[0].alt && (
        <meta property="og:image:alt" content={og_image[0].alt} />
      )}
      {twitter_card && <meta name="twitter:card" content={twitter_card} />}
      {twitter_title && <meta name="twitter:title" content={twitter_title} />}
      {twitter_description && (
        <meta name="twitter:description" content={twitter_description} />
      )}
      {twitter_image && <meta name="twitter:image" content={twitter_image} />}
      {/* {twitterImage?.altText && (
        <meta name="twitter:image:alt" content={twitterImage.altText} />
      )} */}
      {canonical && <link rel="canonical" href={canonical} />}
      {Favicon && (
        <link rel="icon" href={Favicon} sizes="any" type="image/svg+xml" />
      )}
    </Head>
  );
};

export default DocumentHead;
