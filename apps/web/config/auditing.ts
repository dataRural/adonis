import { defineConfig } from '@filipebraida/adonis-auditing'

export default defineConfig({
  userResolver: () => import('#audit_resolvers/user_resolver'),
  resolvers: {
    ip_address: () => import('#audit_resolvers/ip_address_resolver'),
    user_agent: () => import('#audit_resolvers/user_agent_resolver'),
    url: () => import('#audit_resolvers/url_resolver'),
  },

  /**
   * Field names whose values are removed from all automatic CRUD audit rows.
   */
  auditExclude: ['updatedAt', 'createdAt'],

  /**
   * Field names whose values are replaced with '******' in audit rows.
   */
  hiddenFields: ['password'],
})
