// https://dash.cloudflare.com/ec3322e467804cb1edc769ff7004c880/workers/services/edit/luvolas/production
async function blobToBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  for (let b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    const formData = await request.formData();
    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === 'image') {
        const base64 = await blobToBase64(value);
        fields.image = base64;
        fields.filename = value.name;
        fields.mimeType = value.type;
      } else {
        fields[key] = value;
      }
    }

    const response = await fetch("https://script.google.com/macros/s/AKfycbyhwvPXwx02y6IDIkHg-ZRL7FEll1fxHv0aU4cVci2prjRcbaxCqm7XhPqiitoiAYC0/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      }
    });
  }
}


