/**
 * Helper client untuk fetch data dari WPGraphQL (WordPress Headless)
 */

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://smpn1ngawi.local/graphql';

interface FetchGraphQLOptions {
  variables?: Record<string, unknown>;
  revalidate?: number; // Next.js ISR cache revalidation dalam detik
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  options: FetchGraphQLOptions = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: options.variables || {},
      }),
      next: {
        revalidate: options.revalidate !== undefined ? options.revalidate : 60, // default cache 60 detik
      },
    });

    if (!res.ok) {
      return {
        error: `Gagal memuat data dari WordPress: ${res.status} ${res.statusText}`,
      };
    }

    const json = await res.json();

    if (json.errors && json.errors.length > 0) {
      return {
        error: json.errors.map((e: { message: string }) => e.message).join(', '),
      };
    }

    return { data: json.data as T };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan koneksi ke WordPress API';
    return { error: message };
  }
}
