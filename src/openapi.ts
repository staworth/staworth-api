export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Staworth API',
    version: '1.0.0',
    description:
      "Simple REST API for serving Staworth datasets to internal and external applications."
  },
  servers: [
    {
      url: '/',
      description: 'Current deployment'
    }
  ],
  tags: [
    { name: 'System' },
    { name: 'Accounts' },
    { name: 'Articles' },
    { name: 'Links' },
    { name: 'Portfolio' },
    { name: 'Beefy' }
  ],
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'API information',
        responses: {
          '200': {
            description: 'API metadata and endpoint listing',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RootResponse'
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse'
                }
              }
            }
          }
        }
      }
    },
    '/accounts': {
      get: {
        tags: ['Accounts'],
        summary: "Get Staworth's onchain accounts",
        responses: {
          '200': {
            description: 'List of accounts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Account' }
                }
              }
            }
          }
        }
      }
    },
    '/articles': {
      get: {
        tags: ['Articles'],
        summary: "Get Staworth's published articles",
        responses: {
          '200': {
            description: 'List of articles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Article' }
                }
              }
            }
          }
        }
      }
    },
    '/links': {
      get: {
        tags: ['Links'],
        summary: "Get Staworth's important links",
        responses: {
          '200': {
            description: 'List of links',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Link' }
                }
              }
            }
          }
        }
      }
    },
    '/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: "Get Staworth's current portfolio holdings",
        responses: {
          '200': {
            description: 'Portfolio payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Portfolio' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch portfolio',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/portfolio/historic': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get historic portfolio series',
        responses: {
          '200': {
            description: 'Historic portfolio values by date',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricPortfolio' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic portfolio',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/portfolio/historic/type': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get historic portfolio values by type',
        responses: {
          '200': {
            description: 'Historic type values by date',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricPortfolioTypeOnly' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic portfolio type',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/portfolio/historic/exposure': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get historic portfolio values by exposure',
        responses: {
          '200': {
            description: 'Historic exposure values by date',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricPortfolioExposureOnly' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic portfolio exposure',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/portfolio/update': {
      get: {
        tags: ['Portfolio'],
        summary: 'Trigger a portfolio update',
        security: [{ CronSecret: [] }],
        responses: {
          '200': {
            description: 'Update completed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioUpdateSuccess' }
              }
            }
          },
          '401': {
            description: 'Unauthorized trigger',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' }
              }
            }
          },
          '500': {
            description: 'Update failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioUpdateFailure' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Portfolio'],
        summary: 'Trigger a portfolio update',
        security: [{ CronSecret: [] }],
        responses: {
          '200': {
            description: 'Update completed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioUpdateSuccess' }
              }
            }
          },
          '401': {
            description: 'Unauthorized trigger',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' }
              }
            }
          },
          '500': {
            description: 'Update failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioUpdateFailure' }
              }
            }
          }
        }
      }
    },
    '/beefy/balance-sheet': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's latest balance sheet",
        responses: {
          '200': {
            description: 'Balance sheet',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BalanceSheet' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch balance sheet',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/beefy/balance-sheet/historic': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's historic balance sheets",
        responses: {
          '200': {
            description: 'Historic balance sheets',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricBalanceSheet' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic balance sheet',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/beefy/income-statement/annual': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's latest annual income statement",
        responses: {
          '200': {
            description: 'Annual income statement',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IncomeStatement' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch annual income statement',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/beefy/income-statement/quarter': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's latest quarterly income statement",
        responses: {
          '200': {
            description: 'Quarterly income statement',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IncomeStatement' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch quarterly income statement',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/beefy/income-statement/annual/historic': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's historic annual income statements",
        responses: {
          '200': {
            description: 'Historic annual statements',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricIncomeStatement' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic annual income statements',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/beefy/income-statement/quarter/historic': {
      get: {
        tags: ['Beefy'],
        summary: "Get Beefy DAO's historic quarterly income statements",
        responses: {
          '200': {
            description: 'Historic quarterly statements',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HistoricIncomeStatement' }
              }
            }
          },
          '500': {
            description: 'Failed to fetch historic quarterly income statements',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      CronSecret: {
        type: 'apiKey',
        in: 'header',
        name: 'x-cron-secret',
        description: 'Required for manual portfolio update triggers when CRON_SECRET is configured.'
      }
    },
    schemas: {
      RootResponse: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          endpoints: {
            type: 'object',
            additionalProperties: { type: 'string' }
          }
        },
        required: ['name', 'description', 'status', 'endpoints']
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          message: { type: 'string' }
        },
        required: ['status', 'message']
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        },
        required: ['error']
      },
      UnauthorizedResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'unauthorized' }
        },
        required: ['error']
      },
      Account: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          ens: { type: 'string' },
          chains: { type: 'array', items: { type: 'string' } },
          created: { type: 'string' }
        },
        required: ['address', 'ens', 'chains', 'created']
      },
        Article: {
          type: 'object',
          properties: {
            link: { type: 'string' },
            title: { type: 'string' },
            date: { type: 'string' },
            category: { type: 'string' },
            categories: {
              type: 'array',
              items: { type: 'string' }
            },
            description: { type: 'string' },
            image: { type: 'string' }
          },
          required: ['link', 'title', 'date', 'category', 'description', 'image']
        },
      Link: {
        type: 'object',
        properties: {
          link: { type: 'string' },
          img: { type: 'string' },
          label: { type: 'string' }
        },
        required: ['link', 'img', 'label']
      },
      PortfolioItem: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          defi_protocol: { type: 'string', nullable: true },
          exposure: { type: 'string' },
          url: { type: 'string' },
          img: { type: 'string' },
          balance: { type: 'number' },
          value: { type: 'number' }
        },
        required: ['name', 'type', 'url', 'img', 'balance', 'value']
      },
      Portfolio: {
        type: 'object',
        properties: {
          total: {
            type: 'object',
            properties: {
              value: { type: 'number' }
            },
            required: ['value']
          },
          positions: {
            type: 'object',
            additionalProperties: { $ref: '#/components/schemas/PortfolioItem' }
          }
        },
        required: ['positions']
      },
      HistoricPortfolioEntry: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          type: {
            type: 'object',
            properties: {
              governance: { type: 'number' },
              defi: { type: 'number' },
              stablecoin: { type: 'number' },
              native: { type: 'number' },
              other: { type: 'number' }
            },
            required: ['governance', 'defi', 'stablecoin', 'native', 'other']
          },
          exposure: {
            type: 'object',
            properties: {
              eth: { type: 'number' },
              btc: { type: 'number' },
              governance: { type: 'number' },
              'usd stablecoins': { type: 'number' },
              other: { type: 'number' }
            },
            required: ['eth', 'btc', 'governance', 'usd stablecoins', 'other']
          }
        },
        required: ['total', 'type', 'exposure']
      },
      HistoricPortfolio: {
        type: 'object',
        additionalProperties: { $ref: '#/components/schemas/HistoricPortfolioEntry' }
      },
      HistoricPortfolioTypeOnly: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            governance: { type: 'number' },
            defi: { type: 'number' },
            stablecoin: { type: 'number' },
            native: { type: 'number' },
            other: { type: 'number' }
          },
          required: ['governance', 'defi', 'stablecoin', 'native', 'other']
        }
      },
      HistoricPortfolioExposureOnly: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            eth: { type: 'number' },
            btc: { type: 'number' },
            governance: { type: 'number' },
            'usd stablecoins': { type: 'number' },
            other: { type: 'number' }
          },
          required: ['eth', 'btc', 'governance', 'usd stablecoins', 'other']
        }
      },
      PortfolioUpdateSuccess: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', enum: [true] },
          total: { type: 'number' }
        },
        required: ['ok', 'total']
      },
      PortfolioUpdateFailure: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', enum: [false] },
          error: { type: 'string' }
        },
        required: ['ok', 'error']
      },
      BalanceSheetLineItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: ['line_item'] },
          value: { type: 'number' }
        },
        required: ['id', 'label', 'type', 'value']
      },
      BalanceSheetSubsection: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: ['subsection'] },
          value: { type: 'number' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/BalanceSheetLineItem' }
          }
        },
        required: ['id', 'label', 'type', 'value', 'items']
      },
      BalanceSheetSection: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: ['section'] },
          value: { type: 'number' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/BalanceSheetSubsection' }
          }
        },
        required: ['id', 'label', 'type', 'value', 'items']
      },
      BalanceSheet: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          statement_date: { type: 'string' },
          version: { type: 'string' },
          entity: { type: 'string' },
          last_updated: { type: 'string' },
          currency: { type: 'string' },
          sections: {
            type: 'array',
            items: { $ref: '#/components/schemas/BalanceSheetSection' }
          }
        },
        required: ['statement', 'statement_date', 'version', 'entity', 'last_updated', 'currency', 'sections']
      },
      HistoricBalanceSheetEntry: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { $ref: '#/components/schemas/BalanceSheetSection' }
        }
      },
      HistoricBalanceSheet: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          version: { type: 'string' },
          entity: { type: 'string' },
          last_updated: { type: 'string' },
          currency: { type: 'string' },
          historic_statements: {
            type: 'array',
            items: { $ref: '#/components/schemas/HistoricBalanceSheetEntry' }
          }
        },
        required: ['statement', 'version', 'entity', 'last_updated', 'currency', 'historic_statements']
      },
      IncomeStatementLineItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: ['line_item'] },
          value: { type: 'number' }
        },
        required: ['id', 'label', 'type', 'value']
      },
      IncomeStatementSection: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: ['section'] },
          value: { type: 'number' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/IncomeStatementLineItem' }
          }
        },
        required: ['id', 'label', 'type', 'value', 'items']
      },
      IncomeStatement: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          statement_date: { type: 'string' },
          version: { type: 'string' },
          entity: { type: 'string' },
          last_updated: { type: 'string' },
          currency: { type: 'string' },
          sections: {
            type: 'array',
            items: { $ref: '#/components/schemas/IncomeStatementSection' }
          }
        },
        required: ['statement', 'statement_date', 'version', 'entity', 'last_updated', 'currency', 'sections']
      },
      HistoricIncomeStatementEntry: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { $ref: '#/components/schemas/IncomeStatementSection' }
        }
      },
      HistoricIncomeStatement: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          version: { type: 'string' },
          entity: { type: 'string' },
          last_updated: { type: 'string' },
          currency: { type: 'string' },
          sections: {
            type: 'array',
            items: { $ref: '#/components/schemas/HistoricIncomeStatementEntry' }
          }
        },
        required: ['statement', 'version', 'entity', 'last_updated', 'currency', 'sections']
      }
    }
  }
};
