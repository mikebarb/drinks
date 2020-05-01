# app/channels/newperson_channel.rb
class NewpersonChannel < ApplicationCable::Channel
    # Called when the consumer has successfully
    # become a subscriber to this channel.
    def subscribed
      logger.debug "NewpersonChannel class - subscribed called"
      stream_from "newperson_channel"
    end
end