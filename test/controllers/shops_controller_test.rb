require 'test_helper'

class ShopsControllerTest < ActionDispatch::IntegrationTest
  test "should get counter" do
    get shops_counter_url
    assert_response :success
  end

end
