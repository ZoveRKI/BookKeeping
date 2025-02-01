module Mutations
  class Login < BaseMutation
    argument :user_name, String, required: true
    argument :password, String, required: true

    field :is_success, Boolean, null: false
    field :messages, [String], null: true

    def resolve(user_name:, password:)
      # 从数据库中查找用户
      user = User.find_by(user_name: user_name)

      # 简单验证密码是否匹配
      if user && user.authenticate(password)
        context[:session][:current_user_id] = user.id

        { is_success: true, messages: [] }
      else
        { is_success: false, messages: ["Invalid username or password"] }
      end
    end
  end
end
