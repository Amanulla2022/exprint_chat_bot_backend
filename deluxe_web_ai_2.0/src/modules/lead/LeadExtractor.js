export default class LeadExtractor {
  async extract(state) {
    const payload = state.action?.payload?.fields ?? {};

    return {
      name: payload.name?.trim() || null,

      phone: payload.phone?.trim() || null,

      email: payload.email?.trim() || null,

      company: payload.company?.trim() || null,
    };
  }
}
