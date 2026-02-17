export default async function run(input) {
  const message = typeof input?.message === "string" ? input.message : "";
  return { echoed: message };
}
