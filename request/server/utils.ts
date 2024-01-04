export const streamToJson = async (stream: ReadableStream<Uint8Array> | null) => {
  if (!stream) {
    return "";
  }
  const reader = stream.getReader();
  let total = "";

  return reader.read().then(function processResult(result): any {
    if (result.done) {
      return JSON.parse(total);
    }

    total += new TextDecoder("utf-8").decode(result.value);
    return reader.read().then(processResult);
  });
};
export const formatBody = async (body: any, contentType: string) => {
  const jsonBody = await streamToJson(body);
  if (contentType.includes("application/x-www-form-urlencoded") && jsonBody instanceof Object) {
    const keys = Object.keys(jsonBody);
    const values = Object.values(jsonBody) as string[];
    const postData = new URLSearchParams();
    for (let i = 0; i < keys.length; i++) {
      postData.append(keys[i], values[i]);
    }
    return postData.toString();
  }

  return JSON.stringify(jsonBody);
};
