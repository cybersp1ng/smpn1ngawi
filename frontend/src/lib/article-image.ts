export function getArticlePreviewImage(
  contentHtml: string,
  featuredImage?: string,
): string | undefined {
  const imageTags = contentHtml.match(/<img\b[^>]*>/gi) || [];

  for (const imageTag of imageTags) {
    const imageSource = imageTag.match(
      /\b(?:src|data-src)\s*=\s*(["'])(.*?)\1/i,
    )?.[2];

    if (imageSource) {
      return imageSource.replace(/&amp;/g, '&');
    }
  }

  return featuredImage;
}
