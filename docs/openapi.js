window.OPENAPI_SPEC = {
  "openapi": "3.1.0",
  "info": {
    "title": "Match Tracker API",
    "version": "1.0.0",
    "description": "API for searching people by query and managing music artists. Spec auto-generated from Zod schemas."
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local development"
    }
  ],
  "components": {
    "schemas": {
      "ValidationError": {
        "component": {
          "def": {
            "type": "object",
            "shape": {
              "error": {
                "def": {
                  "type": "string"
                },
                "type": "string",
                "format": null,
                "minLength": null,
                "maxLength": null
              },
              "details": {
                "def": {
                  "type": "array",
                  "element": {
                    "def": {
                      "type": "object",
                      "shape": {
                        "field": {
                          "def": {
                            "type": "string"
                          },
                          "type": "string",
                          "format": null,
                          "minLength": null,
                          "maxLength": null
                        },
                        "message": {
                          "def": {
                            "type": "string"
                          },
                          "type": "string",
                          "format": null,
                          "minLength": null,
                          "maxLength": null
                        }
                      }
                    },
                    "type": "object"
                  }
                },
                "type": "array",
                "element": {
                  "def": {
                    "type": "object",
                    "shape": {
                      "field": {
                        "def": {
                          "type": "string"
                        },
                        "type": "string",
                        "format": null,
                        "minLength": null,
                        "maxLength": null
                      },
                      "message": {
                        "def": {
                          "type": "string"
                        },
                        "type": "string",
                        "format": null,
                        "minLength": null,
                        "maxLength": null
                      }
                    }
                  },
                  "type": "object"
                }
              }
            }
          },
          "type": "object"
        }
      }
    },
    "parameters": {}
  },
  "paths": {
    "/api/people/search": {
      "get": {
        "operationId": "searchPeople",
        "summary": "Search people",
        "description": "Search for people by a query string. Scores each person based on substring matches across name, music genres, movies, location, and associated artists. Returns only matches with score > 0, sorted by score descending then name ascending.",
        "tags": [
          "People"
        ],
        "parameters": [
          {
            "schema": {
              "type": "string",
              "minLength": 1,
              "description": "Search query string",
              "example": "ed"
            },
            "required": true,
            "description": "Search query string",
            "name": "q",
            "in": "query"
          }
        ],
        "responses": {
          "200": {
            "description": "List of matching people with scores and matched fields",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "example": "Eddy Verde"
                      },
                      "score": {
                        "type": "number",
                        "example": 6
                      },
                      "matches": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "name",
                            "genres",
                            "movies",
                            "location",
                            "artists"
                          ]
                        },
                        "example": [
                          "name",
                          "artists"
                        ]
                      }
                    },
                    "required": [
                      "name",
                      "score",
                      "matches"
                    ]
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid query parameters",
            "content": {
              "application/json": {
                "schema": {
                  "name": "ValidationError",
                  "ref": {
                    "$ref": "#/components/schemas/ValidationError"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/artists": {
      "post": {
        "operationId": "addArtist",
        "summary": "Add a music artist to a genre",
        "description": "Adds an artist to the specified genre in the in-memory dataset. Duplicates are ignored. Subsequent search calls will reflect this addition.",
        "tags": [
          "Artists"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "genre": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Music genre to add the artist to",
                    "example": "Classical"
                  },
                  "artist": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Artist name to add",
                    "example": "Beethoven"
                  }
                },
                "required": [
                  "genre",
                  "artist"
                ]
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "Artist added successfully"
          },
          "400": {
            "description": "Invalid request body",
            "content": {
              "application/json": {
                "schema": {
                  "name": "ValidationError",
                  "ref": {
                    "$ref": "#/components/schemas/ValidationError"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "webhooks": {}
};
