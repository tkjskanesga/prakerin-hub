function ErrorZodExtract(strError) {
  const [msg, ...params] = String(strError || "")
    .trim()
    .split("|");

  const error_params = Object.fromEntries(
    params.map((line) => line.split(":")),
  );

  return { error: msg, error_params };
}

export default function ValidatorContent(
  schemaProtocol = "",
  zodObject,
  data = {},
) {
  const dataInfo = zodObject.safeParse(data);

  if (dataInfo.success) return null;

  let combinedErrors = "";
  const params = dataInfo.error.issues.map((issue, index) => {
    const extracted = ErrorZodExtract(issue.message);

    combinedErrors += (index === 0 ? "" : "|") + extracted.error.trim();

    return extracted.error_params;
  });

  return {
    error: `${schemaProtocol}:${combinedErrors}`,
    params,
  };
}
