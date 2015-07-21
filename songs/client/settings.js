Template.songSettings.helpers({
    sections: function () {
        return songsections.find({song: this._id});
    },
    
    arrangements: function () {
        return songarrangements.find({song: this._id});
    }
});

Template.songSettings.events({
    'click .song-title': function (event, template) {
        template.$('.song-title').addClass('hidden');
        template.$('.song-title-edit').removeClass('hidden');
    },
    
    'blur .song-title-edit': function (event, template) {
        Meteor.call('songTitle', this._id, template.$('.song-title-edit').val());
        template.$('.song-title-edit').addClass('hidden');
        template.$('.song-title').removeClass('hidden');
    },
    
    'click #section-add': function (event, template) {
        Meteor.call('songAddSection', this._id);
    },
    
    'click #arrangement-add': function (event, template) {
        Meteor.call('songAddArrangement', this._id);
    }
});