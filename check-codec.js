const https = require('https');
const url = "https://wblnwbdcfdiiitvrznmt.supabase.co/storage/v1/object/sign/checkin-me/media-studio/cmsxa7xwk00015327xvkthk1c/video-f9ad2096-8ab0-4a07-bd60-38709ce20fcb.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NzdkNjdhOS02MTM4LTRmNzEtOGFmMi1kYWUzMWFhODU3ZDMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjaGVja2luLW1lL21lZGlhLXN0dWRpby9jbXN4YTd4d2swMDAxNTMyN3h2a3RoazFjL3ZpZGVvLWY5YWQyMDk2LThhYjAtNGEwNy1iZDYwLTM4NzA5Y2UyMGZjYi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2OTc4Mzg0LCJleHAiOjIxMDIzMzgzODR9.kxjUjqu16P9LODD4Dzwb6Dr3VUDHXs1w1K6J_2BqlVE";

https.get(url, { headers: { 'Range': 'bytes=0-10000' } }, (res) => {
  const chunks = [];
  res.on('data', d => chunks.push(d));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    let str = "";
    for(let i=0; i<buf.length; i++) {
        if(buf[i] >= 32 && buf[i] <= 126) str += String.fromCharCode(buf[i]);
    }
    console.log(str.substring(0, 100));
  });
});
