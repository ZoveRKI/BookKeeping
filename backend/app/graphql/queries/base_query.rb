module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    def authenticate_user!
      raise GraphQL::ExecutionError, "You must be logged in" unless context[:current_user]
    end
  end
end
