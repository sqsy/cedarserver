var checkMedia = function (mediaid) {
    var m = media.findOne(mediaid);
    if (m) return m;
    else throw new Meteor.Error('media-not-found', 'Could not find media with the _id: ' + mediaid);
}

Meteor.methods({
    mediaSetNew: function (mediaid, state) {
        var m = checkMedia(mediaid);
        media.update(m, {$set: {new: state}});
    },
    
    mediaTitle: function (mediaid, title) {
        var m = checkMedia(mediaid);
        media.update(m, {$set: {title: title}});
    },
    
    mediaAddTags: function (mediaid, tags) {
        var m = checkMedia(mediaid);
        media.update(m, {$push: {tags: {$each: tags}}});
    },
    
    mediaDelTag: function (mediaid, tag) {
        var m = checkMedia(mediaid);
        media.update(m, {$pull: {tags: tag}});
    },
    
    mediaDel: function (mediaid) {
        var m = checkMedia(mediaid);
        var fs = Npm.require('fs');
        
        var prefix = settings.findOne({key: 'mediadir'}).value + '/';
        
        fs.unlink(prefix + m.location, function () {});
        if (m['thumbnail']) fs.unlink(prefix + m.thumbnail, function () {});

        media.remove(m);
    },

    mediaActionActivate: function (action) {
        var targets = minions.find({type: 'media', stage: action.stage}).fetch();                   
        var actMedia = media.findOne(action.media);
                
        var s = {}; s['layers.' + action.layer] = action;
        targets.forEach(function (minion) {
            if (minion.layers.hasOwnProperty(action.layer))
                minions.update(minion._id, {$set: s});
        });
    }
});
