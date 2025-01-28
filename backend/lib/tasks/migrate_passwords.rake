# Example: https://api.rubyonrails.org/v7.1/classes/ActiveModel/SecurePassword/ClassMethods.html

namespace :data_migration do
  desc "Migrate password to password_digest"
  task migrate_passwords: :environment do
    require 'bcrypt'

    puts "Doing"

    User.find_each do |user|

      if user[:password].present? && user[:password_digest].blank?

        user.password = user[:password]
        status = user.save

        puts "Password for User: #{user.user_name}(status:#{status}) has been migrated"
      end
    end
  end
end
